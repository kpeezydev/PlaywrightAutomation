import { Page } from '@playwright/test';
import { HealingStore } from './store';
import { AiLocatorService } from './ai-service';
import { SelfHealingLocator } from './locator';
import { LocatorContext } from './types';

let _store: HealingStore | null = null;
let _aiService: AiLocatorService | null = null;

export function initHealing(store: HealingStore, aiService: AiLocatorService): void {
  _store = store;
  _aiService = aiService;
}

export function healingLocator(
  page: Page,
  selector: string,
  context?: LocatorContext,
): SelfHealingLocator {
  if (!_store) {
    throw new Error(
      'Self-healing not initialized. Call initHealing() first, ' +
        'or ensure the "healing" fixture is registered in your test setup.',
    );
  }

  return new SelfHealingLocator(page, selector, _store, _aiService!, context);
}
