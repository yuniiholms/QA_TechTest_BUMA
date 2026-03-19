# WeMine Playwright Automation Framework

A professional-grade Playwright automation framework following senior QA best practices.

## Architecture

```
scripts/
├── package.json             # Dependencies & npm scripts
├── playwright.config.ts     # Playwright configuration
├── .env.example             # Environment template
│
└── tests/
    ├── signin.spec.ts               # Sign-in flow tests
    ├── equipment-inspection.spec.ts # Equipment inspection tests
    ├── safety-hazard.spec.ts        # Safety hazard tests
    ├── hazard-report.spec.ts        # Refactored hazard tests (POM)
    │
    ├── fixtures/                    # 📦 Test Data
    │   └── test-data.ts             # Centralized mock data + interfaces
    │
    ├── helpers/                     # 🛠️ Utilities
    │   ├── api-mock.helper.ts       # API mocking utilities
    │   ├── auth.helper.ts           # Authentication helpers
    │   └── index.ts                 # Barrel export
    │
    └── pages/                       # 📄 Page Objects
        ├── base.page.ts             # Base page class
        ├── login.page.ts            # Login page object
        ├── hazard.page.ts           # Hazard page object
        └── index.ts                 # Barrel export
```

## Best Practices Implemented

### 1. Page Object Model (POM)
- Each page has its own class with encapsulated selectors and actions
- Selectors are centralized in private readonly objects
- Page methods return promises for proper async handling

```typescript
// Example: Using page object
const hazardPage = new HazardPage(page);
await hazardPage.fillHazardForm({ locationId: 'loc-1', ... });
await hazardPage.submit();
await hazardPage.expectSuccessMessageVisible();
```

### 2. Clean Code Principles
- **DRY (Don't Repeat Yourself)**: Reusable helpers and page objects
- **Single Responsibility**: Each class/function has one purpose
- **Meaningful Names**: Clear, descriptive method and variable names

### 3. No Hardcoded Waits
```typescript
// ❌ Anti-pattern
await page.waitForTimeout(500);

// ✅ Best practice - smart waits
await expect(element).toBeEnabled();
await page.waitForLoadState('networkidle');
```

### 4. Type Safety
- Full TypeScript interfaces for all test data
- Proper typing for functions and parameters
- IDE autocomplete support

### 5. Test Data Management
- Centralized fixtures in `fixtures/test-data.ts`
- Data generators for dynamic test data
- Mock data follows real API contracts

### 6. API Mocking
- Centralized `ApiMockHelper` class
- Consistent mock setup across tests
- Easy to capture and verify API payloads

## Quick Start

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Run all tests
npm test

# Run specific flow
npm run test:signin
npm run test:hazard

# Run in headed mode (visible browser)
npm run test:headed

# Open interactive UI mode
npm run test:ui

# Generate and view report
npm run report
```

## Writing Tests

### Using Page Objects
```typescript
import { test, expect } from '@playwright/test';
import { HazardPage } from './pages';
import { createApiMockHelper, createAuthHelper } from './helpers';

test.describe('Hazard Report', () => {
  let hazardPage: HazardPage;
  
  test.beforeEach(async ({ page }) => {
    hazardPage = new HazardPage(page);
    const apiMock = createApiMockHelper(page);
    const auth = createAuthHelper(page);
    
    await auth.setupAuthenticatedState();
    await apiMock.setupAuthenticatedMocks();
  });

  test('submit hazard report', async () => {
    await hazardPage.gotoNewReport();
    await hazardPage.fillHazardForm({
      locationId: 'loc-1',
      sublocationId: 'subloc-1a',
      areaId: 'area-1a1'
    });
    await hazardPage.submit();
    await hazardPage.expectSuccessMessageVisible();
  });
});
```

### AAA Pattern
All tests follow **Arrange-Act-Assert** pattern:

```typescript
test('example test', async () => {
  // Arrange - setup test data and preconditions
  let submittedData: any = null;
  await apiMock.mockHazards({
    onSubmit: (data) => { submittedData = data; }
  });

  // Act - perform the action being tested
  await hazardPage.fillHazardForm({ ... });
  await hazardPage.submit();

  // Assert - verify the expected outcome
  expect(submittedData.locationId).toBe('loc-1');
});
```

## npm Scripts

| Script | Description |
|--------|-------------|
| `npm test` | Run all tests |
| `npm run test:headed` | Run with visible browser |
| `npm run test:ui` | Open Playwright UI mode |
| `npm run test:signin` | Run sign-in tests only |
| `npm run test:equipment` | Run equipment inspection tests |
| `npm run test:hazard` | Run hazard report tests |
| `npm run report` | Open HTML test report |

## Test Coverage

| Flow | Test Specs | Test Cases |
|------|------------|------------|
| Sign In | signin.spec.ts | 8 tests |
| Equipment Inspection | equipment-inspection.spec.ts | 10 tests |
| Safety Hazard | hazard-report.spec.ts | 12 tests |

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Playwright Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
          
      - name: Install dependencies
        run: npm ci
        working-directory: testcases/automation/scripts
        
      - name: Install Playwright
        run: npx playwright install --with-deps
        working-directory: testcases/automation/scripts
        
      - name: Run tests
        run: npx playwright test
        working-directory: testcases/automation/scripts
        
      - name: Upload report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: testcases/automation/scripts/playwright-report/
```

## Environment Variables

Create `.env` file from `.env.example`:

```env
BASE_URL=https://wemine-office.example.com
API_URL=https://api.wemine.example.com
TEST_USERNAME=testuser@company.com
TEST_PASSWORD=securepassword
```

