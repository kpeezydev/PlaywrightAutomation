import { test, expect } from '@/fixtures/auth.fixture';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { CheckoutDataFactory } from '@/test-data/factories';
import { TestLogger } from '@/utils/logger';

test.describe('Checkout scenarios', () => {
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ authenticatedPage }, testInfo) => {
    const log = TestLogger.forTest(testInfo.title);
    log.step('adding item to cart and navigating to checkout');
    await authenticatedPage.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await authenticatedPage.locator('.shopping_cart_link').click();
    await authenticatedPage.locator('[data-test="checkout"]').click();

    checkoutPage = new CheckoutPage(authenticatedPage);
  });

  test('should complete checkout successfully', async ({ authenticatedPage }, testInfo) => {
    const log = TestLogger.forTest(testInfo.title);
    log.step('filling in checkout information');
    const checkoutData = CheckoutDataFactory.defaultCheckout();
    await checkoutPage.fillInformation(
      checkoutData.firstName,
      checkoutData.lastName,
      checkoutData.postalCode,
    );
    await checkoutPage.continueCheckout();

    log.step('verifying checkout step two and completing order');
    await expect(authenticatedPage).toHaveURL(/.*checkout-step-two.html/);
    await checkoutPage.finishCheckout();

    log.step('asserting order completion');
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });
});
