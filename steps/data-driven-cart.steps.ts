import { expect } from '@playwright/test';
import { Given, When, Then } from '@/steps/fixtures.steps';
import { SAUCE_PRODUCTS } from '@/test-data/constants';
import { TestLogger } from '@/utils/logger';

Given('I am on the inventory page', async ({ authenticatedPage, $testInfo }) => {
  const log = TestLogger.forTest($testInfo.title);
  log.step('Verifying authenticated session landed on the inventory page');
  await expect(authenticatedPage).toHaveURL(/inventory\.html$/);
});

When('I add the {word} to the cart', async ({ authenticatedPage, $testInfo }, product: string) => {
  const log = TestLogger.forTest($testInfo.title);
  log.step(`Adding ${product} to cart`);
  await authenticatedPage.locator(`[data-test="add-to-cart-${product}"]`).click();
});

Then('the cart badge should show 1 item', async ({ authenticatedPage, $testInfo }) => {
  const log = TestLogger.forTest($testInfo.title);
  await expect(authenticatedPage.locator('.shopping_cart_badge')).toHaveText('1');
  log.step('Verified cart badge count', { count: 1 });
});

Then(
  'every product in the canonical product list is visible on the inventory page',
  async ({ authenticatedPage, $testInfo }) => {
    const log = TestLogger.forTest($testInfo.title);
    const itemNames = await authenticatedPage.locator('.inventory_item_name').allInnerTexts();
    const inventoryItems = itemNames.map((name) => name.toLowerCase());

    for (const canonicalProduct of SAUCE_PRODUCTS) {
      log.step('Verifying product in canonical list', { product: canonicalProduct });
      const slugFragment = canonicalProduct.split('-')[0].toLowerCase();
      const matchesInventory = inventoryItems.some((item) => item.includes(slugFragment));
      expect(
        matchesInventory,
        `Expected canonical product '${canonicalProduct}' to be present in inventory items: ${inventoryItems.join(', ')}`,
      ).toBe(true);
    }
  },
);
