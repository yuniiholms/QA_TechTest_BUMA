# WeMine Test Cases Documentation

## Table of Contents
1. [Test Strategy Overview](#test-strategy-overview)
2. [Folder Structure](#folder-structure)
3. [Tool Selection & Rationale](#tool-selection--rationale)
4. [Test Case Categories](#test-case-categories)
5. [How to Read Test Cases](#how-to-read-test-cases)
6. [How to Run Automation Tests](#how-to-run-automation-tests)
7. [Test Results Interpretation](#test-results-interpretation)

---

## Test Strategy Overview

### Testing Approach
Given WeMine's critical nature (mining site operations) and its key characteristics:
- **Offline-first capability** - requires extensive offline testing
- **Dynamic forms** - requires boundary testing and form validation
- **Multi-platform** - requires cross-platform consistency testing
- **B2B SaaS** - requires multi-tenant isolation testing

### Test Pyramid Applied
```
           /\
          /  \        E2E Tests (10%)
         /----\       - Critical user journeys
        /      \      - Cross-platform flows
       /--------\     Integration Tests (30%)
      /          \    - API contract testing
     /------------\   - Service integration
    /              \  Unit Tests (60%)
   /----------------\ - Component testing
                      - Business logic validation
```

---

## Folder Structure

```
testcases/
├── readme.md                        # This file - main documentation
│
├── manual/                          # 📝 Manual Test Cases
│   ├── flow-0-signin.md             # Sign-in flow test cases
│   ├── flow-1-equipment-inspection.md   # Equipment inspection test cases
│   └── flow-2-safety-hazard.md      # Safety hazard report test cases
│
└── automation/                      # 🤖 Automation Test Cases
    │
    ├── docs/                        # Test Case Documentation
    │   ├── flow-0-signin.md         # Automation scenarios for sign-in
    │   ├── flow-1-equipment-inspection.md
    │   └── flow-2-safety-hazard.md
    │
    └── scripts/                     # Playwright Framework
        ├── package.json             # Dependencies
        ├── playwright.config.ts     # Playwright configuration
        ├── README.md                # Framework documentation
        │
        └── tests/
            ├── signin.spec.ts       # Sign-in test specs
            ├── equipment-inspection.spec.ts
            ├── safety-hazard.spec.ts
            ├── hazard-report.spec.ts    # Refactored with POM
            │
            ├── fixtures/            # 📦 Test Data
            │   └── test-data.ts     # Centralized mock data
            │
            ├── helpers/             # 🛠️ Utilities
            │   ├── api-mock.helper.ts
            │   ├── auth.helper.ts
            │   └── index.ts
            │
            └── pages/               # 📄 Page Objects
                ├── base.page.ts
                ├── login.page.ts
                ├── hazard.page.ts
                └── index.ts
```

---

## Tool Selection & Rationale

### Web Automation: Playwright
**Why Playwright?**
| Criteria | Playwright | Selenium | Cypress |
|----------|-----------|----------|---------|
| Cross-browser | ✅ Chrome, Firefox, Safari | ✅ All browsers | ❌ Limited |
| Auto-wait | ✅ Built-in | ❌ Manual | ✅ Built-in |
| Network mocking | ✅ Excellent | ❌ Limited | ✅ Good |
| Parallel execution | ✅ Native | ⚠️ Grid needed | ❌ Limited |
| API testing | ✅ Built-in | ❌ No | ⚠️ Limited |
| TypeScript | ✅ First-class | ⚠️ Wrapper | ✅ Good |

**Key reasons for WeMine:**
1. **Offline testing** - Playwright's network interception allows simulating offline scenarios
2. **Dynamic forms** - Auto-wait handles dynamically rendered form fields
3. **API + UI testing** - Single tool for both API contract and E2E testing
4. **Microsoft Auth** - Excellent support for handling OAuth/MSAL flows

### Mobile Automation: Detox (React Native) / Appium (Native)
**Why Detox for React Native?**
- Gray-box testing with automatic synchronization
- No flaky tests from timing issues
- Fast execution on simulators/emulators

**Why Appium as fallback?**
- Cross-platform (iOS + Android)
- Supports native, hybrid, and web apps
- Large community and plugin ecosystem

### Test Management: Markdown + Git
**Why not TestRail/Zephyr?**
- Version controlled with code
- Easy to review in PRs
- No additional tool cost
- Portable and accessible

---

## Test Case Categories

### Manual Test Cases
Location: `./manual/`

Manual testing is prioritized for:
1. **Exploratory testing** - Finding edge cases in dynamic forms
2. **Usability testing** - UX validation on mobile devices
3. **Visual testing** - UI consistency across platforms
4. **Offline behavior** - Complex offline scenarios
5. **Notification testing** - Push notification verification on real devices

### Automation Test Cases
Location: `./automation/`

Automation is prioritized for:
1. **Regression testing** - Repeated validation of core flows
2. **API contract testing** - Backend service validation
3. **Data-driven testing** - Form validation with multiple datasets
4. **Smoke testing** - Quick health checks before deployment
5. **Cross-browser testing** - Consistency across browsers

---

## How to Read Test Cases

### Test Case Format
Each test case follows this structure:

```markdown
### TC-[FLOW]-[NUMBER]: [Title]

**Priority**: Critical / High / Medium / Low
**Type**: Positive / Negative / Boundary / Edge Case
**Platform**: Web / Mobile / Both

**Preconditions**:
- Required setup steps

**Test Steps**:
1. Step one
2. Step two
3. Step three

**Expected Results**:
- Expected outcome 1
- Expected outcome 2

**Test Data**:
- Sample data if applicable
```

### Priority Definitions
| Priority | Description | Automation |
|----------|-------------|------------|
| Critical | Core business flow, blocks release | Must automate |
| High | Important feature, major impact | Should automate |
| Medium | Standard feature, moderate impact | Consider automating |
| Low | Minor feature, minimal impact | Manual only |

---

## How to Run Automation Tests

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Installation & Execution
```bash
# Navigate to automation scripts folder
cd automation/scripts

# Install dependencies
npm install

# Install browsers
npx playwright install

# Run all tests
npx playwright test

# Run specific test file
npx playwright test tests/signin.spec.ts

# Run with UI mode
npx playwright test --ui

# Run in headed mode (visible browser)
npx playwright test --headed

# Generate HTML report
npx playwright show-report
```

### Environment Configuration
Create `.env` file in `automation/scripts/`:
```env
BASE_URL=https://wemine-office.example.com
API_URL=https://api.wemine.example.com
TEST_USERNAME=testuser@company.com
TEST_PASSWORD=securepassword
```

---

## Test Results Interpretation

### Playwright HTML Report
After running tests, view results:
```bash
npx playwright show-report
```

Report includes:
- ✅ **Passed**: Test executed successfully
- ❌ **Failed**: Test assertion failed (includes screenshot + trace)
- ⏭️ **Skipped**: Test was skipped (conditional or focused)
- 🔄 **Flaky**: Test passed on retry

### Test Artifacts
Located in `playwright-report/` and `test-results/`:
- **Screenshots**: Captured on failure
- **Videos**: Full test execution recording
- **Traces**: Step-by-step debugging with DOM snapshots

### Metrics to Track
1. **Pass Rate**: Target > 95%
2. **Execution Time**: Monitor for performance regression
3. **Flaky Test Rate**: Target < 2%
4. **Code Coverage**: Track API endpoint coverage

---

## Test Case Index

### Flow 0 - Sign In
| ID | Title | Type | Priority | Automated |
|----|-------|------|----------|-----------|
| TC-0-001 | Valid login with correct credentials | Positive | Critical | ✅ |
| TC-0-002 | Invalid username | Negative | High | ✅ |
| TC-0-003 | Invalid password | Negative | High | ✅ |
| TC-0-004 | Tenant lookup API failure | Negative | High | ✅ |
| TC-0-005 | Master data sync progress | Positive | Medium | ✅ |
| [More in manual/flow-0-signin.md](./manual/flow-0-signin.md) |

### Flow 1 - Equipment Inspection
| ID | Title | Type | Priority | Automated |
|----|-------|------|----------|-----------|
| TC-1-001 | Create form with all field types | Positive | Critical | ✅ |
| TC-1-002 | Submit inspection with valid data | Positive | Critical | ✅ |
| TC-1-003 | Form validation - required fields | Negative | High | ✅ |
| TC-1-004 | Dynamic form rendering | Positive | High | ✅ |
| [More in manual/flow-1-equipment-inspection.md](./manual/flow-1-equipment-inspection.md) |

### Flow 2 - Safety Hazard Report
| ID | Title | Type | Priority | Automated |
|----|-------|------|----------|-----------|
| TC-2-001 | Submit hazard report with all fields | Positive | Critical | ✅ |
| TC-2-002 | PIC notification delivery | Positive | Critical | ⚠️ Manual |
| TC-2-003 | Followup task completion | Positive | Critical | ✅ |
| TC-2-004 | Area notification broadcast | Positive | High | ⚠️ Manual |
| [More in manual/flow-2-safety-hazard.md](./manual/flow-2-safety-hazard.md) |

---

## Best Practices Applied

### 1. Page Object Model (POM)
- Separates test logic from page interactions
- Easy maintenance when UI changes
- Reusable across multiple tests

### 2. Clean Code Architecture
```
tests/
├── fixtures/    → Test data (WHAT to test with)
├── helpers/     → Utilities (HOW to setup)
├── pages/       → Page objects (WHERE to interact)
└── *.spec.ts    → Test specs (WHAT to verify)
```

### 3. No Hardcoded Waits
```typescript
// ❌ Bad
await page.waitForTimeout(500);

// ✅ Good
await expect(element).toBeEnabled();
```

### 4. AAA Pattern
```typescript
test('example', async () => {
  // Arrange - setup
  // Act - perform action
  // Assert - verify result
});
```

