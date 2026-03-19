import { test, expect, Page } from '@playwright/test';

// Mock data
const mockForms = {
  forms: [
    { formCode: 'EQ-INSPECT-001', formName: 'Daily Equipment Check', fieldCount: 5 },
    { formCode: 'EQ-INSPECT-002', formName: 'Weekly Maintenance', fieldCount: 12 },
    { formCode: 'EQ-INSPECT-003', formName: 'Safety Compliance', fieldCount: 8 }
  ]
};

const mockFormTemplate = {
  formCode: 'EQ-INSPECT-001',
  formName: 'Daily Equipment Check',
  fields: [
    { id: 'field-1', type: 'text', label: 'Inspector Notes', required: true },
    { id: 'field-2', type: 'datepicker', label: 'Inspection Date', required: true },
    { id: 'field-3', type: 'select', label: 'Equipment Status', required: true, options: ['Good', 'Fair', 'Poor', 'Critical'] },
    { id: 'field-4', type: 'radio', label: 'Requires Maintenance', required: true, options: ['Yes', 'No'] },
    { id: 'field-5', type: 'imagepicker', label: 'Equipment Photo', required: false }
  ]
};

const mockInspections = {
  inspections: [
    {
      inspectionId: 'insp-001',
      formCode: 'EQ-INSPECT-001',
      formName: 'Daily Equipment Check',
      inspector: 'John Doe',
      createdAt: '2026-03-19T08:00:00Z',
      status: 'submitted'
    },
    {
      inspectionId: 'insp-002',
      formCode: 'EQ-INSPECT-002',
      formName: 'Weekly Maintenance',
      inspector: 'Jane Smith',
      createdAt: '2026-03-18T14:30:00Z',
      status: 'submitted'
    }
  ]
};

// Helper to setup authenticated state
async function setupAuthenticatedState(page: Page) {
  await page.evaluate(() => {
    localStorage.setItem('auth_token', 'mock-jwt-token');
  });
}

test.describe('Flow 1 - Equipment Inspection', () => {
  
  test.beforeEach(async ({ page }) => {
    await setupAuthenticatedState(page);
    
    // Setup common API mocks
    await page.route('**/api/forms', route => route.fulfill({ json: mockForms }));
    await page.route('**/api/forms/EQ-INSPECT-001', route => route.fulfill({ json: mockFormTemplate }));
    await page.route('**/api/inspections', route => {
      if (route.request().method() === 'GET') {
        return route.fulfill({ json: mockInspections });
      }
      // POST - create inspection
      return route.fulfill({ 
        status: 201,
        json: { 
          inspectionId: 'insp-new',
          createdAt: new Date().toISOString(),
          status: 'submitted'
        }
      });
    });
  });

  test.describe('Form Builder (Web)', () => {
    
    test('TC-1-A001: Create form with text field', async ({ page }) => {
      await page.route('**/api/forms', async route => {
        if (route.request().method() === 'POST') {
          const body = route.request().postDataJSON();
          expect(body.formName).toBe('Test Form');
          expect(body.fields).toHaveLength(1);
          expect(body.fields[0].type).toBe('text');
          
          return route.fulfill({
            status: 201,
            json: { formCode: 'EQ-TEST-001', ...body }
          });
        }
        return route.fulfill({ json: mockForms });
      });

      await page.goto('/form-builder');
      await page.click('[data-testid="new-form-button"]');
      
      // Fill form name
      await page.fill('[data-testid="form-name-input"]', 'Test Form');
      
      // Add text field
      await page.click('[data-testid="add-field-text"]');
      await page.fill('[data-testid="field-label-input"]', 'Notes');
      await page.check('[data-testid="field-required-checkbox"]');
      
      // Save form
      await page.click('[data-testid="save-form-button"]');
      
      // Verify success
      await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    });

    test('TC-1-A002: Create form with all field types', async ({ page }) => {
      const fieldTypes = ['text', 'datepicker', 'select', 'radio', 'imagepicker'];
      
      await page.route('**/api/forms', async route => {
        if (route.request().method() === 'POST') {
          const body = route.request().postDataJSON();
          expect(body.fields).toHaveLength(5);
          
          const types = body.fields.map((f: any) => f.type);
          for (const type of fieldTypes) {
            expect(types).toContain(type);
          }
          
          return route.fulfill({ status: 201, json: { formCode: 'EQ-FULL-001' } });
        }
        return route.fulfill({ json: mockForms });
      });

      await page.goto('/form-builder');
      await page.click('[data-testid="new-form-button"]');
      await page.fill('[data-testid="form-name-input"]', 'Complete Form');
      
      // Add each field type
      for (const type of fieldTypes) {
        await page.click(`[data-testid="add-field-${type}"]`);
        await page.fill('[data-testid="field-label-input"]:last-of-type', `${type} Field`);
      }
      
      await page.click('[data-testid="save-form-button"]');
      await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    });

    test('TC-1-A003: Form field limit - maximum 50 fields', async ({ page }) => {
      await page.goto('/form-builder');
      await page.click('[data-testid="new-form-button"]');
      await page.fill('[data-testid="form-name-input"]', 'Max Fields Test');
      
      // Add 50 fields
      for (let i = 0; i < 50; i++) {
        await page.click('[data-testid="add-field-text"]');
      }
      
      // Verify 50 fields added
      const fieldCount = await page.locator('[data-testid="form-field"]').count();
      expect(fieldCount).toBe(50);
      
      // Attempt to add 51st field
      const addButton = page.locator('[data-testid="add-field-text"]');
      
      // Should be disabled or show error
      const isDisabled = await addButton.isDisabled();
      if (!isDisabled) {
        await addButton.click();
        await expect(page.locator('[data-testid="limit-error"]')).toBeVisible();
      }
    });

    test('TC-1-A004: Radio field maximum 4 options', async ({ page }) => {
      await page.goto('/form-builder');
      await page.click('[data-testid="new-form-button"]');
      await page.click('[data-testid="add-field-radio"]');
      
      // Add 4 options
      for (let i = 0; i < 4; i++) {
        await page.click('[data-testid="add-radio-option"]');
        await page.fill(`[data-testid="radio-option-${i}"]`, `Option ${i + 1}`);
      }
      
      // Verify add option button disabled or hidden
      const addOptionButton = page.locator('[data-testid="add-radio-option"]');
      await expect(addOptionButton).toBeDisabled();
    });
  });

  test.describe('Dynamic Form Rendering', () => {
    
    test('TC-1-A007: Form loads based on form code', async ({ page }) => {
      const formCodeA = {
        formCode: 'FORM-A',
        formName: 'Form A',
        fields: [{ id: 'f1', type: 'text', label: 'Field A', required: true }]
      };
      
      const formCodeB = {
        formCode: 'FORM-B',
        formName: 'Form B',
        fields: [
          { id: 'f1', type: 'datepicker', label: 'Field B1', required: true },
          { id: 'f2', type: 'select', label: 'Field B2', required: true, options: ['X', 'Y'] }
        ]
      };
      
      await page.route('**/api/forms/FORM-A', route => route.fulfill({ json: formCodeA }));
      await page.route('**/api/forms/FORM-B', route => route.fulfill({ json: formCodeB }));

      // Test Form A
      await page.goto('/inspection/new?formCode=FORM-A');
      await expect(page.locator('text=Field A')).toBeVisible();
      await expect(page.locator('text=Field B1')).not.toBeVisible();
      
      // Test Form B
      await page.goto('/inspection/new?formCode=FORM-B');
      await expect(page.locator('text=Field B1')).toBeVisible();
      await expect(page.locator('text=Field B2')).toBeVisible();
      await expect(page.locator('text=Field A')).not.toBeVisible();
    });
  });

  test.describe('Form Validation', () => {
    
    test('TC-1-A010: Required field validation - text', async ({ page }) => {
      await page.goto('/inspection/new?formCode=EQ-INSPECT-001');
      
      // Try to submit without filling required fields
      await page.click('[data-testid="submit-button"]');
      
      // Verify validation error on required text field
      await expect(page.locator('[data-testid="field-1-error"]')).toBeVisible();
      await expect(page.locator('[data-testid="field-1-error"]')).toContainText(/required/i);
    });

    test.describe('TC-1-A011: Required field validation - all types', () => {
      const fieldValidations = [
        { id: 'field-1', type: 'text', errorPattern: /required/i },
        { id: 'field-2', type: 'datepicker', errorPattern: /select.*date/i },
        { id: 'field-3', type: 'select', errorPattern: /select.*option/i },
        { id: 'field-4', type: 'radio', errorPattern: /select.*option/i },
      ];

      for (const field of fieldValidations) {
        test(`Validation for ${field.type} field`, async ({ page }) => {
          await page.goto('/inspection/new?formCode=EQ-INSPECT-001');
          await page.click('[data-testid="submit-button"]');
          
          await expect(page.locator(`[data-testid="${field.id}-error"]`)).toBeVisible();
        });
      }
    });
  });

  test.describe('Submission', () => {
    
    test('TC-1-A013: Submit valid inspection', async ({ page }) => {
      let submittedData: any = null;
      
      await page.route('**/api/inspections', async route => {
        if (route.request().method() === 'POST') {
          submittedData = route.request().postDataJSON();
          return route.fulfill({
            status: 201,
            json: { inspectionId: 'new-insp-123', status: 'submitted' }
          });
        }
        return route.fulfill({ json: mockInspections });
      });

      await page.goto('/inspection/new?formCode=EQ-INSPECT-001');
      
      // Fill all required fields
      await page.fill('[data-testid="field-1-input"]', 'Equipment functioning normally');
      await page.fill('[data-testid="field-2-input"]', '2026-03-19');
      await page.selectOption('[data-testid="field-3-select"]', 'Good');
      await page.click('[data-testid="field-4-radio-yes"]');
      
      // Submit
      await page.click('[data-testid="submit-button"]');
      
      // Verify success
      await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
      
      // Verify API payload
      expect(submittedData).toBeTruthy();
      expect(submittedData.formCode).toBe('EQ-INSPECT-001');
      expect(submittedData.fields).toHaveLength(4);
    });

    test('TC-1-A015: View submissions list', async ({ page }) => {
      await page.goto('/inspections');
      
      // Verify list loaded
      await expect(page.locator('[data-testid="inspection-list"]')).toBeVisible();
      
      // Verify items displayed
      await expect(page.locator('[data-testid="inspection-item"]')).toHaveCount(2);
      
      // Verify sorted by date (newest first)
      const dates = await page.locator('[data-testid="inspection-date"]').allTextContents();
      const dateValues = dates.map(d => new Date(d).getTime());
      expect(dateValues[0]).toBeGreaterThanOrEqual(dateValues[1]);
    });
  });
});

// API Contract Tests
test.describe('Flow 1 - API Contract Tests', () => {
  
  test('TC-1-API001: GET /forms - List forms', async ({ request }) => {
    const response = await request.get('/api/forms');
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('forms');
    expect(Array.isArray(data.forms)).toBe(true);
    
    if (data.forms.length > 0) {
      const form = data.forms[0];
      expect(form).toHaveProperty('formCode');
      expect(form).toHaveProperty('formName');
      expect(form).toHaveProperty('fieldCount');
    }
  });

  test('TC-1-API002: POST /forms - Create form', async ({ request }) => {
    const newForm = {
      formName: 'API Test Form',
      fields: [
        { type: 'text', label: 'Test Field', required: true }
      ]
    };

    const response = await request.post('/api/forms', {
      data: newForm
    });
    
    expect(response.status()).toBe(201);
    
    const data = await response.json();
    expect(data).toHaveProperty('formCode');
  });

  test('TC-1-API005: GET /inspections - List submissions', async ({ request }) => {
    const response = await request.get('/api/inspections');
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('inspections');
    expect(Array.isArray(data.inspections)).toBe(true);
  });
});
