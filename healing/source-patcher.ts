import * as fs from 'node:fs';
import * as path from 'node:path';
import { TestLogger } from '@/utils/logger';

const PAGES_DIR = path.resolve(process.cwd(), 'pages');

export class SourcePatcher {
  async patch(originalLocator: string, healedLocator: string): Promise<string | null> {
    const files = this.findPageFiles();
    let patchedPath: string | null = null;

    for (const filePath of files) {
      const updated = this.patchFile(filePath, originalLocator, healedLocator);
      if (updated) {
        if (!patchedPath) {
          patchedPath = filePath;
        }
      }
    }

    if (patchedPath) {
      TestLogger.staticDebug(`Patched: ${originalLocator} -> ${healedLocator} in ${patchedPath}`);
    } else {
      TestLogger.staticDebug(`No page files matched locator "${originalLocator}" for patching`);
    }

    return patchedPath;
  }

  private findPageFiles(): string[] {
    try {
      if (!fs.existsSync(PAGES_DIR)) return [];
      return fs
        .readdirSync(PAGES_DIR)
        .filter((f) => f.endsWith('.ts'))
        .map((f) => path.join(PAGES_DIR, f));
    } catch {
      return [];
    }
  }

  private patchFile(filePath: string, originalLocator: string, healedLocator: string): boolean {
    try {
      const originalContent = fs.readFileSync(filePath, 'utf-8');
      const escapedOriginal = this.escapeForRegex(originalLocator);
      const regex = new RegExp(escapedOriginal, 'g');

      if (!regex.test(originalContent)) {
        return false;
      }

      const updatedContent = originalContent.replace(regex, healedLocator);
      fs.writeFileSync(filePath, updatedContent, 'utf-8');
      return true;
    } catch (err) {
      TestLogger.staticError(`Failed to patch file ${filePath}`, err);
      return false;
    }
  }

  private escapeForRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
  }
}
