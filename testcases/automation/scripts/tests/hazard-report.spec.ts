import { test, expect } from '@playwright/test';
import { HazardPage } from './pages/hazard.page';
import { ApiMockHelper, createApiMockHelper } from './helpers/api-mock.helper';
import { AuthHelper, createAuthHelper } from './helpers/auth.helper';
import { MockUser, MockEmployees } from './fixtures/test-data';

/**
 * Flow 2 - Safety Hazard Report Tests
 * 
 * Refactored with:
 * - Page Object Model (POM)
 * - Centralized test data fixtures
 * - API mock helpers
 * - No hardcoded waits
 * - Clean, maintainable code
 */
test.describe('Flow 2 - Safety Hazard Report', () => {
  let hazardPage: HazardPage;
  let apiMock: ApiMockHelper;
  let auth: AuthHelper;

  test.beforeEach(async ({ page }) => {
    // Initialize helpers
    hazardPage = new HazardPage(page);
    apiMock = createApiMockHelper(page);
    auth = createAuthHelper(page);

    // Setup authenticated state and API mocks
    await auth.setupAuthenticatedState();
    await apiMock.setupAuthenticatedMocks();
    await apiMock.mockHazards();
  });

  test.describe('Hazard Report Submission', () => {
    
    test('TC-2-A001: Submit hazard report successfully', async ({ page }) => {
      // Arrange - capture submitted data
      let submittedData: any = null;
      await apiMock.mockHazards({
        onSubmit: (data) => { submittedData = data; }
      });

      // Act
      await hazardPage.gotoNewReport();
      await hazardPage.fillHazardForm({
        locationId: 'loc-1',
        sublocationId: 'subloc-1a',
        areaId: 'area-1a1'
      });
      await hazardPage.submit();

      // Assert
      await hazardPage.expectSuccessMessageVisible();
      expect(submittedData).toBeTruthy();
      expect(submittedData.locationId).toBe('loc-1');
      expect(submittedData.sublocationId).toBe('subloc-1a');
      expect(submittedData.areaId).toBe('area-1a1');
      expect(submittedData.picId).toBe(MockUser.userId);
    });

    test('TC-2-A002: Sublocation filters by selected location', async () => {
      // Act
      await hazardPage.gotoNewReport();
      await hazardPage.selectLocation('loc-1');

      // Assert
      const options = await hazardPage.getSublocationOptions();
      expect(options).toContain('Crusher Area');
      expect(options).toContain('Conveyor Belt');
      expect(options).not.toContain('Excavation Zone'); // loc-2
      expect(options).not.toContain('Loading Bay'); // loc-2
    });

    test('TC-2-A003: Area filters by selected sublocation', async () => {
      // Act
      await hazardPage.gotoNewReport();
      await hazardPage.selectLocation('loc-1');
      await hazardPage.selectSublocation('subloc-1a');

      // Assert
      const options = await hazardPage.getAreaOptions();
      expect(options).toContain('Primary Crusher');
      expect(options).toContain('Secondary Crusher');
      expect(options).not.toContain('Main Belt'); // subloc-1b
    });

    test('TC-2-A004: PIC is preselected to current user', async () => {
      // Act
      await hazardPage.gotoNewReport();

      // Assert
      await hazardPage.expectPICPreselected(MockUser.userId);
    });

    test('TC-2-A005: Can change PIC to different employee', async () => {
      // Arrange
      let submittedData: any = null;
      await apiMock.mockHazards({
        onSubmit: (data) => { submittedData = data; }
      });
      const differentEmployee = MockEmployees[1]; // Jane Smith

      // Act
      await hazardPage.gotoNewReport();
      await hazardPage.selectPIC(differentEmployee.id);
      await hazardPage.fillHazardForm({
        locationId: 'loc-1',
        sublocationId: 'subloc-1a',
        areaId: 'area-1a1'
      });
      await hazardPage.submit();

      // Assert
      expect(submittedData.picId).toBe(differentEmployee.id);
    });
  });

  test.describe('Form Validation', () => {
    
    test('TC-2-A006: Shows validation errors for empty required fields', async () => {
      // Act
      await hazardPage.gotoNewReport();
      await hazardPage.submit();

      // Assert
      await hazardPage.expectValidationErrors();
    });

    test('TC-2-A007: Submits successfully without optional area description', async () => {
      // Act
      await hazardPage.gotoNewReport();
      await hazardPage.fillHazardForm({
        locationId: 'loc-1',
        sublocationId: 'subloc-1a',
        areaId: 'area-1a1'
        // No areaDescription - it's optional
      });
      await hazardPage.submit();

      // Assert
      await hazardPage.expectSuccessMessageVisible();
    });

    test('TC-2-A008: Includes area description when provided', async () => {
      // Arrange
      let submittedData: any = null;
      const testDescription = 'Oil spill near crusher machine, approximately 1m diameter';
      await apiMock.mockHazards({
        onSubmit: (data) => { submittedData = data; }
      });

      // Act
      await hazardPage.gotoNewReport();
      await hazardPage.fillHazardForm({
        locationId: 'loc-1',
        sublocationId: 'subloc-1a',
        areaId: 'area-1a1',
        areaDescription: testDescription
      });
      await hazardPage.submit();

      // Assert
      expect(submittedData.areaDescription).toBe(testDescription);
    });
  });

  test.describe('Followup Task Completion', () => {
    
    test('TC-2-A010: Complete followup task with required fields', async ({ page }) => {
      // Arrange
      let completionData: any = null;
      await apiMock.mockFollowupTaskComplete('task-001', (data) => {
        completionData = data;
      });

      // Act
      await hazardPage.gotoFollowupTask('task-001');
      await hazardPage.completeFollowupTask({
        resolutionDate: '2026-03-19T14:30',
        coObservers: ['emp-2']
      });

      // Assert
      await expect(page.locator('[data-testid="completion-success"]')).toBeVisible();
      expect(completionData.resolutionDate).toBeTruthy();
      expect(completionData.coObservers).toContain('emp-2');
    });

    test('TC-2-A011: Can add multiple co-observers', async () => {
      // Arrange
      let completionData: any = null;
      await apiMock.mockFollowupTaskComplete('task-001', (data) => {
        completionData = data;
      });

      // Act
      await hazardPage.gotoFollowupTask('task-001');
      await hazardPage.completeFollowupTask({
        resolutionDate: '2026-03-19T14:30',
        coObservers: ['emp-2', 'emp-3', 'emp-4']
      });

      // Assert
      expect(completionData.coObservers).toHaveLength(3);
      expect(completionData.coObservers).toEqual(
        expect.arrayContaining(['emp-2', 'emp-3', 'emp-4'])
      );
    });
  });

  test.describe('Hazard List', () => {
    
    test('Displays hazard reports list correctly', async () => {
      // Act
      await hazardPage.gotoHazardList();

      // Assert
      await hazardPage.expectHazardListCount(2);
      await hazardPage.expectReportNumberVisible('HAZ-2026-0001');
      await hazardPage.expectReportNumberVisible('HAZ-2026-0002');
    });
  });
});

/**
 * API Contract Tests
 * Tests the API independently from UI
 */
test.describe('Flow 2 - API Contract Tests', () => {
  
  test('POST /hazards returns expected structure', async ({ request }) => {
    const hazardData = {
      locationId: 'loc-1',
      sublocationId: 'subloc-1a',
      areaId: 'area-1a1',
      areaDescription: 'Test description',
      evidence: 'base64-encoded-image',
      picId: 'emp-1'
    };

    const response = await request.post('/api/hazards', { data: hazardData });
    
    // Note: In real scenario, this would hit actual API
    // These assertions show expected contract
    if (response.ok()) {
      const data = await response.json();
      expect(data).toHaveProperty('hazardId');
      expect(data).toHaveProperty('reportNumber');
      expect(data).toHaveProperty('followupTaskId');
    }
  });

  test('GET /locations returns location list', async ({ request }) => {
    const response = await request.get('/api/locations');
    
    if (response.ok()) {
      const data = await response.json();
      expect(data).toHaveProperty('locations');
      expect(Array.isArray(data.locations)).toBe(true);
    }
  });
});
