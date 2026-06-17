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
    this.firstNameInput = healingLocator(page, '[data-test="firstName"]', { elementContext: 'first name input' });
    this.lastNameInput = healingLocator(page, '[data-test="lastName"]', { elementContext: 'last name input' });
    this.postalCodeInput = healingLocator(page, '[data-test="postalCode"]', { elementContext: 'postal code input' });
    this.continueButton = healingLocator(page, '[data-test="continue"]', { elementContext: 'continue button' });
    this.finishButton = healingLocator(page, '[data-test="finish"]', { elementContext: 'finish button' });
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
