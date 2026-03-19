import { Page, Locator, expect } from '@playwright/test';

/**
 * Base Page Object
 * Contains common functionality shared across all pages
 * Following Page Object Model (POM) pattern
 */
export abstract class BasePage {
  readonly page: Page;
  
  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a specific path
   */
  async navigate(path: string): Promise<void> {
    await this.page.goto(path);
  }

  /**
   * Wait for element to be visible with custom timeout
   */
  async waitForVisible(locator: Locator, timeout: number = 10000): Promise<void> {
    await expect(locator).toBeVisible({ timeout });
  }

  /**
   * Wait for element to be hidden
   */
  async waitForHidden(locator: Locator, timeout: number = 10000): Promise<void> {
    await expect(locator).toBeHidden({ timeout });
  }

  /**
   * Wait for network idle - better than hardcoded waits
   */
  async waitForNetworkIdle(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Wait for specific API response
   */
  async waitForApiResponse(urlPattern: string | RegExp): Promise<void> {
    await this.page.waitForResponse(urlPattern);
  }

  /**
   * Set authentication state
   */
  async setAuthState(token: string, userData?: object): Promise<void> {
    await this.page.evaluate(({ token, userData }) => {
      localStorage.setItem('auth_token', token);
      if (userData) {
        localStorage.setItem('current_user', JSON.stringify(userData));
      }
    }, { token, userData });
  }

  /**
   * Clear authentication state
   */
  async clearAuthState(): Promise<void> {
    await this.page.evaluate(() => {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('current_user');
    });
  }

  /**
   * Take screenshot with descriptive name
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ 
      path: `test-results/screenshots/${name}-${Date.now()}.png`,
      fullPage: true 
    });
  }

  /**
   * Get element by test ID (consistent selector strategy)
   */
  getByTestId(testId: string): Locator {
    return this.page.locator(`[data-testid="${testId}"]`);
  }
}
