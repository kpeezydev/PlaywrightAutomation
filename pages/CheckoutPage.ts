import { Page, Locator } from '@playwright/test';
import { healingLocator, SelfHealingLocator } from '@/healing';

export class CheckoutPage {
  readonly page: Page;
  readonly firstNameInput: SelfHealingLocator;
  readonly lastNameInput: SelfHealingLocator;
  readonly postalCodeInput: SelfHealingLocator;
  readonly continueButton: SelfHealingLocator;
  readonly finishButton: SelfHealingLocator;
  readonly completeHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = healingLocator(page, '[data-test="firstName"]');
    this.lastNameInput = healingLocator(page, '[data-test="lastName"]');
    this.postalCodeInput = healingLocator(page, '[data-test="postalCode"]');
    this.continueButton = healingLocator(page, '[data-test="continue"]');
    this.finishButton = healingLocator(page, '[data-test="finish"]');
    this.completeHeader = page.locator('.complete-header');
  }

  async fillInformation(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continueCheckout() {
    await this.continueButton.click();
  }

  async finishCheckout() {
    await this.finishButton.click();
  }
}
