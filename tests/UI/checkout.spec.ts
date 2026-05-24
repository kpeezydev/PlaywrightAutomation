import { test, expect } from '@/fixtures/auth.fixture';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { CheckoutDataFactory } from '@/test-data/factories';

test.describe('Checkout scenarios', () => {
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    // Navigate to a pre-condition state where user can checkout
    // For saucedemo, we can add an item to the cart and go to checkout step one
    await authenticatedPage.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await authenticatedPage.locator('.shopping_cart_link').click();
    await authenticatedPage.locator('[data-test="checkout"]').click();

    checkoutPage = new CheckoutPage(authenticatedPage);
  });

  test('should complete checkout successfully', async ({ authenticatedPage }) => {
    const checkoutData = CheckoutDataFactory.defaultCheckout();
    await checkoutPage.fillInformation(checkoutData.firstName, checkoutData.lastName, checkoutData.postalCode);
    await checkoutPage.continueCheckout();

    // Step two checkout verify
    await expect(authenticatedPage).toHaveURL(/.*checkout-step-two.html/);
    await checkoutPage.finishCheckout();

    // Checkout complete verify
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });
});
