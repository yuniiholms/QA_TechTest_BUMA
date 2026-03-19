import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Login Page Object
 * Encapsulates all login page interactions and selectors
 */
export class LoginPage extends BasePage {
  // Selectors - centralized for easy maintenance
  private readonly selectors = {
    usernameInput: '[data-testid="username-input"]',
    continueButton: '[data-testid="continue-button"]',
    errorMessage: '[data-testid="error-message"]',
    validationError: '[data-testid="validation-error"]',
    retryButton: '[data-testid="retry-button"]',
    microsoftLogin: '[data-testid="microsoft-login"]',
    loadingSpinner: '[data-testid="loading-spinner"]'
  };

  // Locators - lazy initialization
  get usernameInput(): Locator {
    return this.page.locator(this.selectors.usernameInput);
  }

  get continueButton(): Locator {
    return this.page.locator(this.selectors.continueButton);
  }

  get errorMessage(): Locator {
    return this.page.locator(this.selectors.errorMessage);
  }

  get validationError(): Locator {
    return this.page.locator(this.selectors.validationError);
  }

  get retryButton(): Locator {
    return this.page.locator(this.selectors.retryButton);
  }

  get microsoftLogin(): Locator {
    return this.page.locator(this.selectors.microsoftLogin);
  }

  // Page Actions
  async goto(): Promise<void> {
    await this.navigate('/login');
  }

  async enterUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  async clickContinue(): Promise<void> {
    await this.continueButton.click();
  }

  async submitUsername(username: string): Promise<void> {
    await this.enterUsername(username);
    await this.clickContinue();
  }

  async waitForMicrosoftLogin(): Promise<void> {
    await this.waitForVisible(this.microsoftLogin, 5000);
  }

  async waitForError(): Promise<void> {
    await this.waitForVisible(this.errorMessage);
  }

  async waitForValidationError(): Promise<void> {
    await this.waitForVisible(this.validationError);
  }

  // Assertions
  async expectErrorMessageContains(text: RegExp | string): Promise<void> {
    await expect(this.errorMessage).toContainText(text);
  }

  async expectValidationErrorContains(text: RegExp | string): Promise<void> {
    await expect(this.validationError).toContainText(text);
  }

  async expectOnLoginPage(): Promise<void> {
    await expect(this.page).toHaveURL(/.*login/);
  }

  async expectRetryButtonVisible(): Promise<void> {
    await expect(this.retryButton).toBeVisible();
  }
}
