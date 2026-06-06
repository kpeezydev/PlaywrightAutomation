import { test as bddTest, createBdd } from 'playwright-bdd';
import { LoginPage } from '@/pages/LoginPage';
import { TestLogger } from '@/utils/logger';

type BddFixtures = {
  apiContext: { response: any };
  authenticatedPage: import('@playwright/test').Page;
};

export const test = bddTest.extend<BddFixtures>({
  apiContext: async ({}, use) => {
    const store = { response: undefined };
    await use(store);
  },
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
