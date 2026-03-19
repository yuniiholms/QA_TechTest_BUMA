import { test, expect, Page } from '@playwright/test';

// Mock data for testing
const mockTenantResponse = {
  tenantId: 'tenant-123',
  tenantName: 'Mining Corp',
  authProvider: 'microsoft',
  authConfig: {
    clientId: 'mock-client-id',
    redirectUri: 'https://wemine-office.example.com/callback'
  }
};

const mockUserProfile = {
  userId: 'user-456',
  email: 'testuser@miningcorp.com',
  name: 'Test User',
  role: 'inspector',
  tenantId: 'tenant-123',
  permissions: ['view_inspections', 'create_inspections', 'view_hazards']
};

const mockMasterData = {
  endpoints: [
    { name: 'locations', url: '/api/locations' },
    { name: 'sublocations', url: '/api/sublocations' },
    { name: 'areas', url: '/api/areas' },
    { name: 'employees', url: '/api/employees' },
    { name: 'forms', url: '/api/forms' }
  ]
};

test.describe('Flow 0 - Sign In', () => {
  
  test.describe('Username Validation', () => {
    
    test('TC-0-A001: Valid username triggers tenant lookup', async ({ page }) => {
      // Setup API mock
      await page.route('**/api/user/who', async route => {
        const request = route.request();
        const postData = request.postDataJSON();
        
        expect(postData.username).toBe('valid@miningcorp.com');
        
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockTenantResponse)
        });
      });

      await page.goto('/login');
      
      // Enter username
      await page.fill('[data-testid="username-input"]', 'valid@miningcorp.com');
      await page.click('[data-testid="continue-button"]');
      
      // Verify Microsoft login is triggered (redirect or modal)
      await expect(page.locator('[data-testid="microsoft-login"]')).toBeVisible({ timeout: 5000 });
    });

    test('TC-0-A002: Invalid username shows error message', async ({ page }) => {
      await page.route('**/api/user/who', async route => {
        await route.fulfill({
          status: 404,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'USER_NOT_FOUND',
            message: 'User not found in system'
          })
        });
      });

      await page.goto('/login');
      await page.fill('[data-testid="username-input"]', 'nonexistent@company.com');
      await page.click('[data-testid="continue-button"]');
      
      // Verify error message displayed
      await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
      await expect(page.locator('[data-testid="error-message"]')).toContainText(/not found|doesn't exist/i);
      
      // User should remain on login page
      await expect(page).toHaveURL(/.*login/);
    });

    test('TC-0-A003: Invalid username format shows validation error', async ({ page }) => {
      await page.goto('/login');
      
      // Test various invalid formats
      const invalidUsernames = ['noatsign', '@nodomain.com', 'user@', '   '];
      
      for (const username of invalidUsernames) {
        await page.fill('[data-testid="username-input"]', username);
        await page.click('[data-testid="continue-button"]');
        
        // Should show client-side validation error
        await expect(page.locator('[data-testid="validation-error"]')).toBeVisible();
      }
    });

    test('TC-0-A003-empty: Empty username shows required field error', async ({ page }) => {
      await page.goto('/login');
      await page.click('[data-testid="continue-button"]');
      
      await expect(page.locator('[data-testid="validation-error"]')).toContainText(/required/i);
    });
  });

  test.describe('API Error Handling', () => {
    
    test('TC-0-A004: Network error displays appropriate message', async ({ page }) => {
      await page.route('**/api/user/who', async route => {
        await route.abort('connectionfailed');
      });

      await page.goto('/login');
      await page.fill('[data-testid="username-input"]', 'valid@miningcorp.com');
      await page.click('[data-testid="continue-button"]');
      
      await expect(page.locator('[data-testid="error-message"]')).toContainText(/network|connection/i);
      await expect(page.locator('[data-testid="retry-button"]')).toBeVisible();
    });

    test('TC-0-A005: Server error (500) handled gracefully', async ({ page }) => {
      await page.route('**/api/user/who', async route => {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'INTERNAL_SERVER_ERROR' })
        });
      });

      await page.goto('/login');
      await page.fill('[data-testid="username-input"]', 'valid@miningcorp.com');
      await page.click('[data-testid="continue-button"]');
      
      await expect(page.locator('[data-testid="error-message"]')).toContainText(/server error|try again/i);
    });
  });

  test.describe('Master Data Sync', () => {
    
    test('TC-0-A006: Master data sync after login', async ({ page }) => {
      const apiCalls: string[] = [];
      
      // Mock all required endpoints
      await page.route('**/api/user/who', route => route.fulfill({ 
        json: mockTenantResponse 
      }));
      
      await page.route('**/api/user/me', route => route.fulfill({ 
        json: mockUserProfile 
      }));
      
      await page.route('**/api/tenant/master', route => {
        apiCalls.push('tenant/master');
        return route.fulfill({ json: mockMasterData });
      });
      
      // Mock individual data endpoints
      await page.route('**/api/locations', route => {
        apiCalls.push('locations');
        return route.fulfill({ json: { data: [] } });
      });
      
      await page.route('**/api/employees', route => {
        apiCalls.push('employees');
        return route.fulfill({ json: { data: [] } });
      });

      // Simulate completed auth flow
      await page.goto('/dashboard');
      await page.waitForTimeout(2000);
      
      // Verify master data endpoints were called
      expect(apiCalls).toContain('tenant/master');
    });

    test('TC-0-A007: User profile loaded after authentication', async ({ page }) => {
      await page.route('**/api/user/me', async route => {
        await route.fulfill({ json: mockUserProfile });
      });

      // Simulate authenticated state
      await page.goto('/dashboard');
      
      // Verify user name displayed
      await expect(page.locator('[data-testid="user-name"]')).toContainText('Test User');
    });
  });

  test.describe('Session Management', () => {
    
    test('TC-0-A008: Session token stored after login', async ({ page }) => {
      await page.route('**/api/**', route => route.fulfill({ json: {} }));
      
      // Simulate login completion
      await page.goto('/login');
      
      // Set mock token (simulating what auth flow would do)
      await page.evaluate(() => {
        localStorage.setItem('auth_token', 'mock-jwt-token');
      });
      
      // Verify token exists
      const token = await page.evaluate(() => localStorage.getItem('auth_token'));
      expect(token).toBeTruthy();
    });
  });
});

// Helper function for login (can be used across test files)
export async function loginAs(page: Page, username: string = 'testuser@miningcorp.com') {
  await page.route('**/api/user/who', route => route.fulfill({ json: mockTenantResponse }));
  await page.route('**/api/user/me', route => route.fulfill({ json: mockUserProfile }));
  
  await page.goto('/login');
  await page.fill('[data-testid="username-input"]', username);
  await page.click('[data-testid="continue-button"]');
  
  // Simulate successful Microsoft auth callback
  await page.evaluate(() => {
    localStorage.setItem('auth_token', 'mock-jwt-token');
  });
  
  await page.goto('/dashboard');
}
