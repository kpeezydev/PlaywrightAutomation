import * as fs from 'fs';
import * as path from 'path';
import { TestLogger } from '@/utils/logger';

const PAGES_DIR = path.resolve(process.cwd(), 'pages');

export class SourcePatcher {
  async patch(originalLocator: string, healedLocator: string): Promise<void> {
    const files = this.findPageFiles();
    let patchedCount = 0;

    for (const filePath of files) {
      const updated = this.patchFile(filePath, originalLocator, healedLocator);
      if (updated) {
        patchedCount++;
      }
    }

    if (patchedCount === 0) {
      TestLogger.staticDebug(`No page files matched locator "${originalLocator}" for patching`);
    } else {
      TestLogger.staticDebug(
        `Patched ${patchedCount} file(s): ${originalLocator} -> ${healedLocator}`,
      );
    }
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
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
