import { test as bddTest, createBdd } from 'playwright-bdd';
import { LoginPage } from '@/pages/LoginPage';
import { TestLogger } from '@/utils/logger';
import { UserFactory } from '@/test-data/factories';
import { HealingStore, AiLocatorService, initHealing } from '@/healing';

type BddFixtures = {
  apiContext: { response: any };
  authenticatedPage: import('@playwright/test').Page;
};

export const test = bddTest.extend<BddFixtures>({
  apiContext: async (
    // eslint-disable-next-line no-empty-pattern
    {},
    use,
  ) => {
    const store = { response: undefined };
    await use(store);
  },
  healing: [
    async (
      // eslint-disable-next-line no-empty-pattern
      {},
      use,
    ) => {
      const healingStore = new HealingStore();
      await healingStore.load();
      const aiService = new AiLocatorService();
      initHealing(healingStore, aiService);
      await use();
    },
    { scope: 'worker', auto: true },
  ],
  authenticatedPage: async ({ page }, use, testInfo) => {
    const log = TestLogger.forTest(testInfo.title);
    log.step('Setting up authenticated session — navigating to login page');
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    const user = UserFactory.validUser();
    log.step(`Logging in as ${user.username}`);
    await loginPage.login(user.username, user.password);
    log.step('Waiting for inventory page to confirm login');
    await page.waitForURL('**/inventory.html');
    await use(page);
  },
});

export const { Given, When, Then } = createBdd(test);
