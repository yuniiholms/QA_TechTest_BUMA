# Test Reports

This folder contains test execution reports and templates for documenting test results.

## Report Types

### 1. Automation Test Reports (Auto-generated)

Playwright automatically generates reports when tests are executed.

**Location after running tests:**
```
testcases/automation/scripts/playwright-report/
testcases/automation/scripts/test-results/
```

**How to generate & view:**
```bash
cd testcases/automation/scripts
npm install
npx playwright test
npx playwright show-report
```

**Report includes:**
- ✅ Passed tests
- ❌ Failed tests (with screenshots & traces)
- ⏭️ Skipped tests
- 📊 Execution time & statistics

### 2. Manual Test Execution Reports

Use templates below to document manual test execution results.

---

## Manual Test Execution Template

Copy and fill this template for each test execution cycle:

```markdown
# Manual Test Execution Report

## Test Information
| Field | Value |
|-------|-------|
| **Date** | YYYY-MM-DD |
| **Tester** | Name |
| **Environment** | Staging / Production |
| **Build Version** | X.X.X |
| **Device/Browser** | Chrome 120 / iPhone 15 / etc |

## Summary
| Metric | Count |
|--------|-------|
| Total Test Cases | XX |
| Passed | XX |
| Failed | XX |
| Blocked | XX |
| Not Executed | XX |
| **Pass Rate** | XX% |

## Test Results by Flow

### Flow 0 - Sign In
| TC ID | Title | Status | Notes |
|-------|-------|--------|-------|
| TC-0-001 | Valid login | ✅ Pass | - |
| TC-0-002 | Invalid username | ✅ Pass | - |
| TC-0-003 | Invalid password | ❌ Fail | Bug #123 |

### Flow 1 - Equipment Inspection
| TC ID | Title | Status | Notes |
|-------|-------|--------|-------|
| TC-1-001 | Create form | ✅ Pass | - |
| ... | ... | ... | ... |

### Flow 2 - Safety Hazard Report
| TC ID | Title | Status | Notes |
|-------|-------|--------|-------|
| TC-2-001 | Submit hazard | ✅ Pass | - |
| ... | ... | ... | ... |

## Failed Tests Details
| TC ID | Expected | Actual | Bug ID | Screenshot |
|-------|----------|--------|--------|------------|
| TC-0-003 | Error message shown | App crashed | BUG-123 | [link] |

## Blockers & Issues
- Issue 1: Description
- Issue 2: Description

## Recommendations
- Recommendation 1
- Recommendation 2

## Sign-off
| Role | Name | Date | Signature |
|------|------|------|-----------|
| QA Engineer | | | |
| QA Lead | | | |
```

---

## Sample Reports

### Sample: Automation Test Run
```
Test Run: 2026-03-19 14:30
Environment: Staging
Total: 30 tests
Passed: 28 (93.3%)
Failed: 2 (6.7%)
Duration: 2m 45s

Failed Tests:
1. TC-1-A003: Form field limit - timeout waiting for element
2. TC-2-A010: Complete followup - assertion failed
```

### Sample: Manual Test Cycle
```
Test Cycle: Sprint 15 Release
Date: 2026-03-19
Tester: John Doe
Environment: Staging v2.5.0

Results:
- Flow 0: 12/12 passed (100%)
- Flow 1: 17/18 passed (94.4%)
- Flow 2: 20/22 passed (90.9%)

Overall: 49/52 passed (94.2%)
```

---

## Metrics to Track

| Metric | Target | Formula |
|--------|--------|---------|
| Pass Rate | > 95% | (Passed / Total) × 100 |
| Automation Coverage | > 60% | (Automated / Total) × 100 |
| Flaky Test Rate | < 2% | (Flaky / Automated) × 100 |
| Defect Detection Rate | - | Bugs found / Total bugs |

---

## Archive Policy

- Keep detailed reports for **current release**
- Archive summary reports for **past 3 months**
- Store critical release reports **permanently**
