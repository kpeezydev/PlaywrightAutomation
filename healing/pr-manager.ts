import * as fs from 'node:fs';
import * as path from 'node:path';
import { execSync } from 'node:child_process';
import { HealingStore } from './store';
import { HealingEntry } from './types';
import { SourcePatcher } from './source-patcher';
import { TestLogger } from '@/utils/logger';

const STORE_FILE = path.resolve(process.cwd(), 'healing-store.json');

function log(msg: string): void {
  console.log(`[PrManager] ${msg}`);
  TestLogger.staticDebug(msg);
}

function logError(msg: string, err?: unknown): void {
  const detail = err instanceof Error ? err.message : String(err ?? '');
  console.error(`[PrManager] ERROR: ${msg}${detail ? ` — ${detail}` : ''}`);
  TestLogger.staticError(msg, err);
}

export class PrManager {
  private readonly store: HealingStore;
  private readonly baseBranch: string;
  private gitConfigured = false;

  constructor(store: HealingStore, options?: { baseBranch?: string }) {
    this.store = store;
    this.baseBranch = options?.baseBranch ?? 'master';
  }

  async processAll(): Promise<void> {
    if (process.env.HEALING_RAISE_PR !== 'true') {
      log('HEALING_RAISE_PR not set to true. Skipping.');
      return;
    }

    const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
    if (!token) {
      log('No GH_TOKEN or GITHUB_TOKEN found. Skipping.');
      return;
    }

    if (!fs.existsSync(STORE_FILE)) {
      log('No healing-store.json found. Nothing to process.');
      return;
    }

    const raw = fs.readFileSync(STORE_FILE, 'utf-8');
    const entries: HealingEntry[] = JSON.parse(raw);
    const pending = entries.filter((e) => !e.prUrl);

    if (pending.length === 0) {
      log('No pending healings to PR.');
      return;
    }

    log(`Found ${pending.length} pending healing(s). Starting PR creation...`);

    for (const entry of pending) {
      await this.raisePr(entry);
    }
  }

  private async ensureGitConfigured(): Promise<void> {
    if (this.gitConfigured) return;
    try {
      this.exec(`git config user.name "playwright-automation-heal"`);
      this.exec(`git config user.email "playwright-automation-heal@users.noreply.github.com"`);
      this.gitConfigured = true;
    } catch (err) {
      logError('Failed to configure git user', err);
      throw err;
    }
  }

  private async raisePr(entry: HealingEntry): Promise<void> {
    const branchName = this.buildBranchName(entry);
    log(`Processing: ${entry.originalLocator} -> ${entry.healedLocator} (branch: ${branchName})`);

    try {
      await this.ensureGitConfigured();

      log(`Creating local tracking branch for ${this.baseBranch}...`);
      this.exec(`git fetch origin ${this.baseBranch} 2>&1`);
      this.exec(`git checkout -B ${this.baseBranch} origin/${this.baseBranch} 2>&1`);

      log(`Creating branch ${branchName}...`);
      this.exec(`git checkout -b ${branchName}`);

      const sourcePatcher = new SourcePatcher();
      const patchedFile = await sourcePatcher.patch(entry.originalLocator, entry.healedLocator);

      if (!patchedFile) {
        log(`No source file matched for ${entry.originalLocator}. Skipping PR.`);
        this.exec(`git checkout ${this.baseBranch} 2>&1`);
        this.exec(`git branch -D ${branchName} 2>&1`);
        return;
      }

      const relativePath = path.relative(process.cwd(), patchedFile);
      log(`Patching ${relativePath}...`);
      this.exec(`git add "${relativePath}"`);
      this.exec(
        `git commit -m "fix: heal locator ${entry.originalLocator} -> ${entry.healedLocator}"`,
      );

      log(`Pushing branch ${branchName}...`);
      this.execWithRemoteToken(`push origin ${branchName}`);

      const title = `fix: heal locator ${entry.originalLocator} -> ${entry.healedLocator}`;
      const body = this.buildPrBody(entry);
      const bodyFile = path.resolve(
        process.cwd(),
        `.pr-body-${this.sanitizeForFilename(entry.originalLocator)}.md`,
      );
      fs.writeFileSync(bodyFile, body, 'utf-8');

      log('Creating draft PR...');
      const prUrl = this.exec(
        `gh pr create --base ${this.baseBranch} --head ${branchName} --title "${title}" --body-file "${bodyFile}" --draft`,
      );

      fs.unlinkSync(bodyFile);

      const trimmedUrl = prUrl.trim();
      entry.prUrl = trimmedUrl;
      entry.prBranch = branchName;
      this.persistEntry(entry);

      log(`PR created: ${trimmedUrl}`);
    } catch (err) {
      logError(`Failed to create PR for ${entry.originalLocator}`, err);
    }
  }

  private buildBranchName(entry: HealingEntry): string {
    const prefix = 'heal/auto';
    if (entry.context?.elementContext) {
      const sanitized = entry.context.elementContext
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      if (sanitized.length > 0) {
        return `${prefix}/${sanitized}`;
      }
    }
    const hash = this.simpleHash(entry.originalLocator);
    return `${prefix}/${hash}`;
  }

  private buildPrBody(entry: HealingEntry): string {
    const rows: string[] = [
      '## Automated Locator Heal',
      '',
      '| Field | Value |',
      '|---|---|',
      `| Original Locator | \`${entry.originalLocator}\` |`,
      `| Healed Locator | \`${entry.healedLocator}\` |`,
      `| Page URL | ${entry.pageUrl} |`,
      `| Confidence | ${entry.confidence} |`,
      `| Timestamp | ${entry.timestamp} |`,
    ];

    if (entry.context?.elementContext) {
      rows.push(`| Element Context | ${entry.context.elementContext} |`);
    }
    if (entry.context?.stepContext) {
      rows.push(`| Step Context | ${entry.context.stepContext} |`);
    }

    rows.push(
      '',
      'This PR was automatically generated by the self-healing locator system.',
      'Please review and verify the corrected locator before merging.',
    );

    return rows.join('\n');
  }

  private sanitizeForFilename(str: string): string {
    return str.replace(/[^a-z0-9]/gi, '_');
  }

  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }

  private exec(cmd: string): string {
    return execSync(cmd, {
      encoding: 'utf-8',
      cwd: process.cwd(),
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
  }

  private execWithRemoteToken(gitArgs: string): string {
    const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
    if (!token) {
      throw new Error('GH_TOKEN/GITHUB_TOKEN is required to push branches');
    }
    const repoSlug = this.exec('git config --get remote.origin.url')
      .replace(/^https:\/\/github\.com\//, '')
      .replace(/\.git$/, '');
    const authedUrl = `https://x-access-token:${token}@github.com/${repoSlug}.git`;
    try {
      return execSync(`git ${gitArgs}`, {
        encoding: 'utf-8',
        cwd: process.cwd(),
        stdio: ['pipe', 'pipe', 'pipe'],
        env: {
          ...process.env,
          GIT_ASKPASS: undefined,
          GIT_TERMINAL_PROMPT: '0',
        },
      })
        .trim();
    } catch (err) {
      if (err instanceof Error) {
        const stderr =
          // @ts-expect-error - execSync populates stderr on ChildProcessError
          typeof err.stderr === 'string' ? err.stderr : '';
        const stdout =
          // @ts-expect-error - execSync populates stdout on ChildProcessError
          typeof err.stdout === 'string' ? err.stdout : '';
        const detail = [stderr.trim(), stdout.trim()].filter(Boolean).join(' | ');
        throw new Error(
          `git ${gitArgs} failed${detail ? `: ${detail}` : ''} (url=https://github.com/${repoSlug}.git)`,
        );
      }
      throw err;
    }
  }

  private persistEntry(entry: HealingEntry): void {
    if (!fs.existsSync(STORE_FILE)) return;
    const raw = fs.readFileSync(STORE_FILE, 'utf-8');
    const entries: HealingEntry[] = JSON.parse(raw);
    const idx = entries.findIndex((e) => e.originalLocator === entry.originalLocator);
    if (idx !== -1) {
      entries[idx] = entry;
      fs.writeFileSync(STORE_FILE, JSON.stringify(entries, null, 2), 'utf-8');
    }
  }
}

export async function run(): Promise<void> {
  const dotenv = (await import('dotenv')).config;
  dotenv();

  const store = new HealingStore();
  await store.load();

  const manager = new PrManager(store);
  await manager.processAll();
}

run().catch((err) => {
  console.error('[PrManager] Fatal error:', err);
  process.exit(1);
});
