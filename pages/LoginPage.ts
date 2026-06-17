import { Page, Locator } from '@playwright/test';
import { healingLocator, SelfHealingLocator } from '@/healing';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: SelfHealingLocator;
  readonly passwordInput: SelfHealingLocator;
  readonly loginButton: SelfHealingLocator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = healingLocator(page, '[data-test="password1"]', { elementContext: 'username input box' });
    this.passwordInput = healingLocator(page, '[data-test="username1"]', { elementContext: 'password input box' });
    this.loginButton = healingLocator(page, '[data-test="login-button"]', { elementContext: 'login button' });
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async goto() {
    await this.page.goto('/');
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
