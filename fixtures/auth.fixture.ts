import { test as base } from '@playwright/test';
import { LoginPage } from '@/pages/LoginPage';

type AuthFixtures = {
  authenticatedPage: LoginPage['page'];
};

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    // Use the standard dummy credentials
    await loginPage.login('standard_user', 'secret_sauce');
    // Verify successful login before passing the page to the test
    await page.waitForURL('**/inventory.html');

    await use(page);
  },
});

export { expect } from '@playwright/test';
