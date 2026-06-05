import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from './bdd-test';
import { CheckoutPage } from '@/pages/CheckoutPage';

const { Given, When, Then } = createBdd(test);

Given('I am authenticated on saucedemo.com', async ({ authenticatedPage }) => {
  await expect(authenticatedPage).toHaveURL(/inventory\.html$/);
});

When(
  'I add {string} to the cart',
  async ({ authenticatedPage }, productName: string) => {
    const dataTest = `add-to-cart-${productName.toLowerCase().replace(/\s+/g, '-')}`;
    await authenticatedPage.locator(`[data-test="${dataTest}"]`).click();
  },
);

When('I navigate to the cart and proceed to checkout', async ({ authenticatedPage }) => {
  await authenticatedPage.locator('.shopping_cart_link').click();
  await authenticatedPage.locator('[data-test="checkout"]').click();
});

When(
  'I fill checkout information with first name {string}, last name {string}, and postal code {string}',
  async ({ authenticatedPage }, firstName: string, lastName: string, postalCode: string) => {
    const checkoutPage = new CheckoutPage(authenticatedPage);
    await checkoutPage.fillInformation(firstName, lastName, postalCode);
  },
);

When('I continue to checkout overview', async ({ authenticatedPage }) => {
  await authenticatedPage.locator('[data-test="continue"]').click();
});

When('I finish the checkout', async ({ authenticatedPage }) => {
  await expect(authenticatedPage).toHaveURL(/checkout-step-two\.html$/);
  await authenticatedPage.locator('[data-test="finish"]').click();
});

Then(
  'I should see the order completion message {string}',
  async ({ authenticatedPage }, expectedMessage: string) => {
    const checkoutPage = new CheckoutPage(authenticatedPage);
    await expect(checkoutPage.completeHeader).toHaveText(expectedMessage);
  },
);
