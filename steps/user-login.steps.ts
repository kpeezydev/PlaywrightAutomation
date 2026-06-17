import { expect } from '@playwright/test';
import { Given, When, Then } from '@/steps/fixtures.steps';
import { SelfHealingLocator } from '@/healing';
import { LoginPage } from '@/pages/LoginPage';
import { UserFactory, UrlFactory } from '@/test-data/factories';
import { API_TEST_USERS } from '@/test-data/constants';
import { TestLogger } from '@/utils/logger';
import { apiRequest } from '@/utils/api-helper';

Given('I am on the login page', async ({ page, $testInfo }) => {
  SelfHealingLocator.stepContext = 'I am on the login page';
  const log = TestLogger.forTest($testInfo.title);
  log.step('Navigating to login page');
  const loginPage = new LoginPage(page);
  await loginPage.goto();
});

When('I enter valid credentials', async ({ page, $testInfo }) => {
  SelfHealingLocator.stepContext = 'I enter valid credentials';
  const log = TestLogger.forTest($testInfo.title);
  log.step('Entering valid credentials');
  const loginPage = new LoginPage(page);
  const user = UserFactory.validUser();
  await loginPage.login(user.username, user.password);
});

When('I enter locked-out user credentials', async ({ page, $testInfo }) => {
  SelfHealingLocator.stepContext = 'I enter locked-out user credentials';
  const log = TestLogger.forTest($testInfo.title);
  log.step('Entering locked-out user credentials');
  const loginPage = new LoginPage(page);
  const user = UserFactory.lockedOutUser();
  await loginPage.login(user.username, user.password);
});

When('I click the login button', async ({ page, $testInfo }) => {
  SelfHealingLocator.stepContext = 'I click the login button';
  const log = TestLogger.forTest($testInfo.title);
  log.step('Clicking login button');
  const loginPage = new LoginPage(page);
  await loginPage.loginButton.click();
});

Then('I should be redirected to the inventory page', async ({ page, $testInfo }) => {
  SelfHealingLocator.stepContext = 'I should be redirected to the inventory page';
  const log = TestLogger.forTest($testInfo.title);
  log.step('Verifying redirect to inventory page');
  await expect(page).toHaveURL(/inventory\.html$/);
});

Then(
  'I should see an error message indicating the user has been locked out',
  async ({ page, $testInfo }) => {
    SelfHealingLocator.stepContext = 'I should see an error message indicating the user has been locked out';
    const log = TestLogger.forTest($testInfo.title);
    log.step('Verifying locked-out error message');
    const loginPage = new LoginPage(page);
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Sorry, this user has been locked out.');
  },
);

When(
  'I authenticate via API with valid credentials',
  async ({ request, apiContext, $testInfo }) => {
    const user = API_TEST_USERS.VALID;
    const payload = { username: user.username, password: user.password };
    await apiRequest(request, apiContext, $testInfo, {
      method: 'POST',
      url: UrlFactory.dummyJsonLogin(),
      data: payload,
    });
  },
);

When(
  'I authenticate via API with invalid credentials',
  async ({ request, apiContext, $testInfo }) => {
    const payload = {
      username: API_TEST_USERS.VALID.username,
      password: API_TEST_USERS.INVALID_PASSWORD,
    };
    await apiRequest(request, apiContext, $testInfo, {
      method: 'POST',
      url: UrlFactory.dummyJsonLogin(),
      data: payload,
    });
  },
);

Then('the API authentication response should be valid', async ({ apiContext, $testInfo }) => {
  const log = TestLogger.forTest($testInfo.title);
  log.step('Verifying API authentication response is valid');
  expect(apiContext.response.status).toBe(200);
  expect(apiContext.response.body.accessToken).toBeDefined();
  expect(typeof apiContext.response.body.accessToken).toBe('string');
});

Then(
  'the API authentication response should indicate an error',
  async ({ apiContext, $testInfo }) => {
    const log = TestLogger.forTest($testInfo.title);
    log.step('Verifying API authentication error response');
    expect(apiContext.response.status).toBe(400);
    expect(apiContext.response.body.message).toBe('Invalid credentials');
  },
);
