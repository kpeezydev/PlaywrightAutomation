import * as fs from 'node:fs';
import * as path from 'node:path';
import { HealingEntry } from './types';
import { TestLogger } from '@/utils/logger';

const STORE_FILE = path.resolve(process.cwd(), 'healing-store.json');

export class HealingStore {
  private readonly cache: Map<string, HealingEntry> = new Map();
  private loaded = false;
  private readonly validatedKeys = new Set<string>();

  async load(): Promise<void> {
    if (this.loaded) return;
    this.loaded = true;

    if (!fs.existsSync(STORE_FILE)) {
      TestLogger.staticDebug('No healing-store.json found, starting fresh');
      return;
    }

    try {
      const raw = fs.readFileSync(STORE_FILE, 'utf-8');
      const entries: HealingEntry[] = JSON.parse(raw);
      for (const entry of entries) {
        this.cache.set(entry.originalLocator, entry);
      }
      TestLogger.staticDebug(`Loaded ${entries.length} healing entries from store`);
    } catch (err) {
      TestLogger.staticError('Failed to load healing-store.json', err);
    }
  }

  get(originalLocator: string): HealingEntry | undefined {
    return this.cache.get(originalLocator);
  }

  set(entry: HealingEntry): void {
    this.cache.set(entry.originalLocator, entry);
    this.persist();
  }

  remove(originalLocator: string): void {
    this.cache.delete(originalLocator);
    this.validatedKeys.delete(originalLocator);
    this.persist();
  }

  isRevalidationRequired(originalLocator: string): boolean {
    return !this.validatedKeys.has(originalLocator);
  }

  markValidated(originalLocator: string): void {
    this.validatedKeys.add(originalLocator);
  }

  private persist(): void {
    try {
      const entries = Array.from(this.cache.values());
      fs.writeFileSync(STORE_FILE, JSON.stringify(entries, null, 2), 'utf-8');
    } catch (err) {
      TestLogger.staticError('Failed to persist healing-store.json', err);
    }
  }
}
