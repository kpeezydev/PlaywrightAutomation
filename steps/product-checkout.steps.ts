import { expect } from '@playwright/test';
import { Given, When, Then } from '@/steps/fixtures.steps';
import { SelfHealingLocator } from '@/healing';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { CheckoutDataFactory, ApiTestDataFactory, UrlFactory } from '@/test-data/factories';
import { TestLogger } from '@/utils/logger';
import { apiRequest } from '@/utils/api-helper';

Given('I am authenticated on saucedemo', async ({ authenticatedPage, $testInfo }) => {
  SelfHealingLocator.stepContext = 'I am authenticated on saucedemo';
  const log = TestLogger.forTest($testInfo.title);
  log.step('Verifying authenticated session on sauce demo');
  await expect(authenticatedPage).toHaveURL(/inventory\.html$/);
});

When('I add a product to the cart', async ({ authenticatedPage, $testInfo }) => {
  SelfHealingLocator.stepContext = 'I add a product to the cart';
  const log = TestLogger.forTest($testInfo.title);
  log.step('Adding sauce-labs-backpack to cart');
  await authenticatedPage.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
});

When('I proceed to checkout', async ({ authenticatedPage, $testInfo }) => {
  SelfHealingLocator.stepContext = 'I proceed to checkout';
  const log = TestLogger.forTest($testInfo.title);
  log.step('Opening cart and proceeding to checkout');
  await authenticatedPage.locator('.shopping_cart_link').click();
  await authenticatedPage.locator('[data-test="checkout"]').click();
});

When('I fill in checkout information', async ({ authenticatedPage, $testInfo }) => {
  SelfHealingLocator.stepContext = 'I fill in checkout information';
  const log = TestLogger.forTest($testInfo.title);
  log.step('Filling in checkout information form');
  const checkoutPage = new CheckoutPage(authenticatedPage);
  const data = CheckoutDataFactory.defaultCheckout();
  await checkoutPage.fillInformation(data.firstName, data.lastName, data.postalCode);
  await checkoutPage.continueCheckout();
  log.step('Verifying navigation to checkout step two');
  await expect(authenticatedPage).toHaveURL(/checkout-step-two\.html$/);
});

When('I complete the order', async ({ authenticatedPage, $testInfo }) => {
  SelfHealingLocator.stepContext = 'I complete the order';
  const log = TestLogger.forTest($testInfo.title);
  log.step('Completing the order');
  const checkoutPage = new CheckoutPage(authenticatedPage);
  await checkoutPage.finishCheckout();
});

Then('I should see the order confirmation message', async ({ authenticatedPage, $testInfo }) => {
  SelfHealingLocator.stepContext = 'I should see the order confirmation message';
  const log = TestLogger.forTest($testInfo.title);
  log.step('Verifying order confirmation message');
  const checkoutPage = new CheckoutPage(authenticatedPage);
  await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
});

When('I add products to cart via the dummyjson API', async ({ request, apiContext, $testInfo }) => {
  await apiRequest(request, apiContext, $testInfo, {
    method: 'POST',
    url: UrlFactory.dummyJsonCartsAdd(),
    data: ApiTestDataFactory.checkoutPayload(),
  });
});

Then(
  'the cart response should contain correct product totals',
  async ({ apiContext, $testInfo }) => {
    const log = TestLogger.forTest($testInfo.title);
    log.step('Verifying cart response product totals', {
      totalProducts: apiContext.response.body.totalProducts,
      totalQuantity: apiContext.response.body.totalQuantity,
    });
    expect(apiContext.response.body.id).toBeDefined();
    expect(apiContext.response.body.totalProducts).toBe(2);
    expect(apiContext.response.body.totalQuantity).toBe(3);
    expect(apiContext.response.body.products.length).toBe(2);
  },
);

When(
  'I send an order completion request to postman-echo',
  async ({ request, apiContext, $testInfo }) => {
    await apiRequest(request, apiContext, $testInfo, {
      method: 'POST',
      url: UrlFactory.postmanEchoPost(),
      data: ApiTestDataFactory.orderPayload(),
    });
  },
);

Then('the order response should echo back the order details', async ({ apiContext, $testInfo }) => {
  const log = TestLogger.forTest($testInfo.title);
  log.step('Verifying order response echoes back details');
  expect(apiContext.response.status).toBe(200);
  expect(apiContext.response.body.data).toBeDefined();
  expect(apiContext.response.body.data.orderId).toBe(12345);
  expect(apiContext.response.body.data.status).toBe('COMPLETED');
});
