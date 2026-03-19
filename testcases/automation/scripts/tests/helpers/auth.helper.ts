import { Page } from '@playwright/test';
import { MockUser, UserProfile } from '../fixtures/test-data';

/**
 * Authentication Helper
 * Handles all authentication-related test utilities
 */
export class AuthHelper {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Set up authenticated state with mock token
   */
  async setupAuthenticatedState(user: UserProfile = MockUser): Promise<void> {
    await this.page.evaluate(({ user }) => {
      localStorage.setItem('auth_token', 'mock-jwt-token-for-testing');
      localStorage.setItem('current_user', JSON.stringify(user));
    }, { user });
  }

  /**
   * Clear all authentication data
   */
  async clearAuth(): Promise<void> {
    await this.page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  }

  /**
   * Get current auth token
   */
  async getAuthToken(): Promise<string | null> {
    return this.page.evaluate(() => localStorage.getItem('auth_token'));
  }

  /**
   * Get current user from storage
   */
  async getCurrentUser(): Promise<UserProfile | null> {
    const userData = await this.page.evaluate(() => 
      localStorage.getItem('current_user')
    );
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getAuthToken();
    return token !== null && token.length > 0;
  }
}

/**
 * Factory function
 */
export function createAuthHelper(page: Page): AuthHelper {
  return new AuthHelper(page);
}
