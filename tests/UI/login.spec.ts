import { test, expect } from '@playwright/test';
import { LoginPage } from '@/pages/LoginPage';
import { UserFactory } from '@/test-data/factories';
import { TestLogger } from '@/utils/logger';

test.describe('Login scenarios', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    TestLogger.step('navigating to login page');
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    TestLogger.step('filling in valid credentials');
    const user = UserFactory.validUser();
    await loginPage.login(user.username, user.password);

    TestLogger.step('asserting successful login redirect');
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('should display error message with invalid credentials', async () => {
    TestLogger.step('filling in locked-out user credentials');
    const user = UserFactory.lockedOutUser();
    await loginPage.login(user.username, user.password);

    TestLogger.step('asserting error message is displayed');
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Sorry, this user has been locked out.');
  });
});
