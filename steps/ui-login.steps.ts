import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from './bdd-test';
import { LoginPage } from '@/pages/LoginPage';
import { TestLogger } from '@/utils/logger';

const { Given, When, Then } = createBdd(test);

Given('I am on the login page', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
});

When(
  'I enter username {string} and password {string}',
  async ({ page }, username: string, password: string) => {
    const loginPage = new LoginPage(page);
    await loginPage.usernameInput.fill(username);
    await loginPage.passwordInput.fill(password);
  },
);

When('I click on the login button', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.loginButton.click();
});

Then('I should be redirected to the inventory page', async ({ page, $testInfo }) => {
  const log = TestLogger.forTest($testInfo.title);
  log.step('asserting successful login redirect');
  await expect(page).toHaveURL(/inventory\.html$/);
});

Then(
  'I should see an error message containing {string}',
  async ({ page }, expectedMessage: string) => {
    const loginPage = new LoginPage(page);
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(expectedMessage);
  },
);
