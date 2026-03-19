import { Page, Route } from '@playwright/test';
import { 
  MockTenant, 
  MockUser, 
  MockLocations, 
  MockSublocations, 
  MockAreas, 
  MockEmployees, 
  MockHazards 
} from '../fixtures/test-data';

/**
 * API Mock Helper
 * Centralizes all API mocking logic for consistent test setup
 * Following DRY principle and Single Responsibility
 */
export class ApiMockHelper {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Setup all common API mocks for authenticated scenarios
   */
  async setupAuthenticatedMocks(): Promise<void> {
    await Promise.all([
      this.mockUserWho(),
      this.mockUserMe(),
      this.mockLocations(),
      this.mockSublocations(),
      this.mockAreas(),
      this.mockEmployees()
    ]);
  }

  /**
   * Mock tenant lookup endpoint
   */
  async mockUserWho(response = MockTenant, status = 200): Promise<void> {
    await this.page.route('**/api/user/who', route => 
      route.fulfill({ status, json: response })
    );
  }

  /**
   * Mock user profile endpoint
   */
  async mockUserMe(response = MockUser): Promise<void> {
    await this.page.route('**/api/user/me', route => 
      route.fulfill({ json: response })
    );
  }

  /**
   * Mock locations dropdown data
   */
  async mockLocations(): Promise<void> {
    await this.page.route('**/api/locations', route => 
      route.fulfill({ json: { locations: MockLocations } })
    );
  }

  /**
   * Mock sublocations with location filtering
   */
  async mockSublocations(): Promise<void> {
    await this.page.route('**/api/sublocations*', route => {
      const url = new URL(route.request().url());
      const locationId = url.searchParams.get('locationId');
      const data = locationId 
        ? { sublocations: MockSublocations[locationId] || [] }
        : { sublocations: [] };
      return route.fulfill({ json: data });
    });
  }

  /**
   * Mock areas with sublocation filtering
   */
  async mockAreas(): Promise<void> {
    await this.page.route('**/api/areas*', route => {
      const url = new URL(route.request().url());
      const sublocationId = url.searchParams.get('sublocationId');
      const data = sublocationId 
        ? { areas: MockAreas[sublocationId] || [] }
        : { areas: [] };
      return route.fulfill({ json: data });
    });
  }

  /**
   * Mock employees list
   */
  async mockEmployees(): Promise<void> {
    await this.page.route('**/api/employees', route => 
      route.fulfill({ json: { employees: MockEmployees } })
    );
  }

  /**
   * Mock hazards endpoint with GET/POST handling
   */
  async mockHazards(options?: {
    onSubmit?: (data: any) => void;
    submitResponse?: object;
  }): Promise<void> {
    await this.page.route('**/api/hazards', route => {
      if (route.request().method() === 'POST') {
        if (options?.onSubmit) {
          options.onSubmit(route.request().postDataJSON());
        }
        return route.fulfill({
          status: 201,
          json: options?.submitResponse || {
            hazardId: `haz-${Date.now()}`,
            reportNumber: 'HAZ-2026-0003',
            followupTaskId: 'task-new',
            createdAt: new Date().toISOString()
          }
        });
      }
      return route.fulfill({ json: { hazards: MockHazards } });
    });
  }

  /**
   * Mock followup task completion
   */
  async mockFollowupTaskComplete(
    taskId: string, 
    onComplete?: (data: any) => void
  ): Promise<void> {
    await this.page.route(`**/api/followup-tasks/${taskId}/complete`, route => {
      if (onComplete) {
        onComplete(route.request().postDataJSON());
      }
      return route.fulfill({
        status: 200,
        json: { taskId, status: 'completed', completedAt: new Date().toISOString() }
      });
    });
  }

  /**
   * Mock network failure
   */
  async mockNetworkError(urlPattern: string): Promise<void> {
    await this.page.route(urlPattern, route => route.abort('connectionfailed'));
  }

  /**
   * Mock server error (500)
   */
  async mockServerError(urlPattern: string): Promise<void> {
    await this.page.route(urlPattern, route => 
      route.fulfill({
        status: 500,
        json: { error: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong' }
      })
    );
  }

  /**
   * Mock 404 not found
   */
  async mockNotFound(urlPattern: string, errorCode = 'NOT_FOUND'): Promise<void> {
    await this.page.route(urlPattern, route => 
      route.fulfill({
        status: 404,
        json: { error: errorCode, message: 'Resource not found' }
      })
    );
  }

  /**
   * Capture API calls for verification
   */
  async captureApiCalls(urlPattern: string): Promise<string[]> {
    const calls: string[] = [];
    await this.page.route(urlPattern, route => {
      calls.push(route.request().url());
      return route.continue();
    });
    return calls;
  }
}

/**
 * Factory function for easy instantiation
 */
export function createApiMockHelper(page: Page): ApiMockHelper {
  return new ApiMockHelper(page);
}
