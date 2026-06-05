import { test as base, APIResponse } from 'playwright-bdd';
import { LoginPage } from '@/pages/LoginPage';
import { UserFactory } from '@/test-data/factories';

type BddFixtures = {
  authenticatedPage: LoginPage['page'];
  apiWorld: {
    response: APIResponse | null;
    body: Record<string, unknown> | null;
  };
};

export const test = base.extend<BddFixtures>({
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    const user = UserFactory.validUser();
    
    await loginPage.login(user.username, user.password);
    await page.waitForURL('**/inventory.html');
    await use(page);
  },
  apiWorld: async ({}, use) => {
    await use({ response: null, body: null });
  },
});
