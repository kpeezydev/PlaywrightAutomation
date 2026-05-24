import { test, expect } from '@playwright/test';
import { LoginPage } from '@/pages/LoginPage';
import { UserFactory } from '@/test-data/factories';

test.describe('Login scenarios', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    const user = UserFactory.validUser();
    await loginPage.login(user.username, user.password);
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('should display error message with invalid credentials', async () => {
    const user = UserFactory.lockedOutUser();
    await loginPage.login(user.username, user.password);
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Sorry, this user has been locked out.');
  });
});
