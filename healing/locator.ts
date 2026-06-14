import { Locator, Page } from '@playwright/test';
import { HealingStore } from './store';
import { AiLocatorService } from './ai-service';
import { TestLogger } from '@/utils/logger';

const HEALING_ENABLED = process.env.HEALING_ENABLED !== 'false';
const SOURCE_PATCH_ENABLED = process.env.HEALING_PATCH_SOURCE === 'true';

type LocatorAction<T> = (loc: Locator) => Promise<T>;

export class SelfHealingLocator {
  private readonly page: Page;
  private readonly originalSelector: string;
  private readonly store: HealingStore;
  private readonly aiService: AiLocatorService;
  private healedSelector: string | null = null;

  constructor(page: Page, selector: string, store: HealingStore, aiService: AiLocatorService) {
    this.page = page;
    this.originalSelector = selector;
    this.store = store;
    this.aiService = aiService;
  }

  private get currentLocator(): Locator {
    const selector = this.healedSelector ?? this.originalSelector;
    return this.page.locator(selector);
  }

  async click(options?: Parameters<Locator['click']>[0]): Promise<void> {
    return this.withHealing((loc) => loc.click(options));
  }

  async fill(value: string, options?: Parameters<Locator['fill']>[0]): Promise<void> {
    return this.withHealing((loc) => loc.fill(value, options));
  }

  async type(value: string, options?: Parameters<Locator['press']>[0]): Promise<void> {
    return this.withHealing((loc) => loc.press(value, options));
  }

  async press(key: string, options?: Parameters<Locator['press']>[0]): Promise<void> {
    return this.withHealing((loc) => loc.press(key, options));
  }

  async isVisible(options?: Parameters<Locator['isVisible']>[0]): Promise<boolean> {
    return this.withHealing((loc) => loc.isVisible(options));
  }

  async textContent(options?: Parameters<Locator['textContent']>[0]): Promise<string | null> {
    return this.withHealing((loc) => loc.textContent(options));
  }

  async inputValue(options?: Parameters<Locator['inputValue']>[0]): Promise<string> {
    return this.withHealing((loc) => loc.inputValue(options));
  }

  async getAttribute(
    name: string,
    options?: Parameters<Locator['getAttribute']>[1],
  ): Promise<string | null> {
    return this.withHealing((loc) => loc.getAttribute(name, options));
  }

  private async withHealing<T>(action: LocatorAction<T>): Promise<T> {
    const loc = this.currentLocator;

    try {
      if (this.healedSelector === null) {
        const count = await loc.count();
        if (count === 0) {
          throw new Error(`locator not found: ${this.originalSelector}`);
        }
      }
      return await action(loc);
    } catch (err) {
      if (!HEALING_ENABLED) {
        throw err;
      }

      const errMsg = String(err);
      const isNotFound =
        errMsg.includes('locator') &&
        (errMsg.includes('not found') ||
          errMsg.includes('no element') ||
          errMsg.includes('Target closed') ||
          errMsg.includes('detached') ||
          errMsg.toLowerCase().includes('timeout'));

      if (!isNotFound) {
        throw err;
      }

      TestLogger.staticStep(`Locator failed: ${this.originalSelector}. Initiating healing.`);

      const resolvedSelector = await this.heal();
      if (!resolvedSelector) {
        const errorMsg = `Self-healing failed for locator: ${this.originalSelector}. No replacement found.`;
        TestLogger.staticError(errorMsg);
        throw new Error(errorMsg);
      }

      const healedLoc = this.page.locator(resolvedSelector);
      return await action(healedLoc);
    }
  }

  private async heal(): Promise<string | null> {
    const cached = this.store.get(this.originalSelector);
    if (cached) {
      const needsRevalidation = this.store.isRevalidationRequired(this.originalSelector);
      if (!needsRevalidation) {
        TestLogger.staticStep('Using cached healed locator', { locator: cached.healedLocator });
        this.healedSelector = cached.healedLocator;
        return cached.healedLocator;
      }

      const stillValid = await this.validateOnPage(cached.healedLocator);
      this.store.markValidated(this.originalSelector);
      if (stillValid) {
        TestLogger.staticStep('Cached locator still valid', { locator: cached.healedLocator });
        this.healedSelector = cached.healedLocator;
        return cached.healedLocator;
      }

      TestLogger.staticStep('Cached locator stale, re-healing', { locator: this.originalSelector });
      this.store.remove(this.originalSelector);
    }

    const pageHtml = await this.page.content();
    const candidates = await this.aiService.findReplacementLocators(
      pageHtml,
      this.originalSelector,
    );

    for (const candidate of candidates) {
      const isValid = await this.validateOnPage(candidate.locator);
      if (isValid) {
        this.healedSelector = candidate.locator;

        this.store.set({
          originalLocator: this.originalSelector,
          healedLocator: candidate.locator,
          pageUrl: this.page.url(),
          confidence: candidate.confidence,
          timestamp: new Date().toISOString(),
        });

        this.store.markValidated(this.originalSelector);
        TestLogger.staticStep('Replacement locator selected', {
          originalLocator: this.originalSelector,
          replacementLocator: candidate.locator,
          confidence: candidate.confidence,
        });
        TestLogger.staticStep('Healed locator', {
          originalLocator: this.originalSelector,
          replacementLocator: candidate.locator,
        });

        if (SOURCE_PATCH_ENABLED) {
          await this.patchSourceFile(candidate.locator);
        }

        return candidate.locator;
      }
    }

    return null;
  }

  private async validateOnPage(selector: string): Promise<boolean> {
    try {
      const count = await this.page.locator(selector).count();
      return count > 0;
    } catch {
      return false;
    }
  }

  private async patchSourceFile(newSelector: string): Promise<void> {
    try {
      const { SourcePatcher } = await import('./source-patcher');
      const patcher = new SourcePatcher();
      await patcher.patch(this.originalSelector, newSelector);
    } catch (err) {
      TestLogger.staticError('Source file patching failed', err);
    }
  }
}
