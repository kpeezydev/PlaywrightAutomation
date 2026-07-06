import { Page } from '@playwright/test';
import { healingLocator, SelfHealingLocator } from '@/healing';

export class LogoutPage {
  readonly page: Page;
  readonly burgerMenuButton: SelfHealingLocator;
  readonly logoutLink: SelfHealingLocator;

  constructor(page: Page) {
    this.page = page;
    this.burgerMenuButton = healingLocator(page, '.bm-burger-button button', { elementContext: 'burger menu button' });
    this.logoutLink = healingLocator(page, '#logout_sidebar_link', { elementContext: 'logout sidebar link' });
  }

  async logout(): Promise<void> {
    await this.burgerMenuButton.click();
    await this.logoutLink.click();
  }
}
