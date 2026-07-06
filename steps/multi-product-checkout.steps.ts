import { expect } from '@playwright/test';
import { Given, When, Then } from '@/steps/fixtures.steps';
import { SelfHealingLocator } from '@/healing';
import { TestLogger } from '@/utils/logger';
import { LogoutPage } from '@/pages/LogoutPage';

When('I add the following products to the cart: {string}', async ({ authenticatedPage, $testInfo }, products: string) => {
  SelfHealingLocator.stepContext = 'I add multiple products to the cart';
  const log = TestLogger.forTest($testInfo.title);
  const productList = products.split(',').map((p) => p.trim());
  log.step(`Adding products to cart`, { products: productList });
  for (const product of productList) {
    await authenticatedPage.locator(`[data-test="add-to-cart-${product}"]`).click();
    log.step(`Added ${product} to cart`);
  }
});

When('I log out', async ({ authenticatedPage, $testInfo }) => {
  SelfHealingLocator.stepContext = 'I log out';
  const log = TestLogger.forTest($testInfo.title);
  log.step('Logging out via burger menu');
  const logoutPage = new LogoutPage(authenticatedPage);
  await logoutPage.logout();
});

Then('I should be redirected to the login page', async ({ authenticatedPage, $testInfo }) => {
  SelfHealingLocator.stepContext = 'I should be redirected to the login page';
  const log = TestLogger.forTest($testInfo.title);
  log.step('Verifying redirect to login page');
  await expect(authenticatedPage).toHaveURL(/\/$/);
});
