import { test as base, Page } from '@playwright/test';
import { HealingStore } from './store';
import { AiLocatorService } from './ai-service';
import { SelfHealingLocator } from './locator';
import { LocatorContext } from './types';

type HealingFixtures = {
  healingStore: HealingStore;
  aiLocatorService: AiLocatorService;
};

export const test = base.extend<HealingFixtures>({
  healingStore: [
    async (
      // eslint-disable-next-line no-empty-pattern
      {},
      use,
    ) => {
      const store = new HealingStore();
      await store.load();
      await use(store);
    },
    { scope: 'worker' },
  ],

  aiLocatorService: [
    async (
      // eslint-disable-next-line no-empty-pattern
      {},
      use,
    ) => {
      const service = new AiLocatorService();
      await use(service);
    },
    { scope: 'worker' },
  ],
});

export function createHealingLocator(
  page: Page,
  selector: string,
  store: HealingStore,
  aiService: AiLocatorService,
  context?: LocatorContext,
): SelfHealingLocator {
  return new SelfHealingLocator(page, selector, store, aiService, context);
}
