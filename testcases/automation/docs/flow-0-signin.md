# Flow 0 - Sign In: Automation Test Cases

## Overview
Automated tests for sign-in flow focus on API contract validation, UI interactions, and error handling. Microsoft OAuth flow requires special handling with mock responses for consistent testing.

---

## Automation Strategy

### What to Automate:
- Username validation and API calls
- Error message display
- Master data sync verification
- Session persistence
- Network failure handling

### What NOT to Automate:
- Actual Microsoft OAuth (use mocks)
- Visual appearance (use manual)
- First-time restart experience (environment setup complex)

---

## Test Cases

### TC-0-A001: Valid Username Triggers Tenant Lookup
**Priority**: Critical  
**Automation Framework**: Playwright  
**File**: `tests/signin.spec.ts`

**Test Steps**:
1. Navigate to login page
2. Enter valid username
3. Intercept `/user/who` API call
4. Verify request payload
5. Verify tenant data received

**Assertions**:
- API called with correct username
- Response contains tenant ID
- Response contains Microsoft auth config

```typescript
test('valid username triggers tenant lookup', async ({ page }) => {
  await page.route('**/user/who', route => {
    route.fulfill({ json: mockTenantResponse });
  });
  
  await page.goto('/login');
  await page.fill('[data-testid="username"]', 'valid@company.com');
  await page.click('[data-testid="continue"]');
  
  // Verify API was called
  // Verify Microsoft login triggered
});
```

---

### TC-0-A002: Invalid Username Shows Error
**Priority**: High  
**Automation Framework**: Playwright

**Test Steps**:
1. Navigate to login page
2. Enter non-existent username
3. Mock 404 response from `/user/who`
4. Submit form
5. Verify error message displayed

**Assertions**:
- Error message visible
- Error message contains "not found" or equivalent
- User remains on login page

---

### TC-0-A003: Invalid Username Format Validation
**Priority**: High  
**Automation Framework**: Playwright

**Test Steps**:
1. Navigate to login page
2. Enter invalid format username
3. Submit form
4. Verify client-side validation

**Test Data**:
| Input | Expected Error |
|-------|----------------|
| `noatsign` | Invalid email format |
| `@nodomain.com` | Invalid email format |
| `user@` | Invalid email format |
| ` ` (empty) | Required field |

**Assertions**:
- Validation error shown before API call
- No network request made

---

### TC-0-A004: API Failure Handling - Network Error
**Priority**: High  
**Automation Framework**: Playwright

**Test Steps**:
1. Navigate to login page
2. Simulate network failure for `/user/who`
3. Enter valid username
4. Submit form
5. Verify error handling

**Assertions**:
- Network error message displayed
- Retry option available
- No application crash

---

### TC-0-A005: API Failure Handling - Server Error (500)
**Priority**: High  
**Automation Framework**: Playwright

**Test Steps**:
1. Navigate to login page
2. Mock 500 response from `/user/who`
3. Enter valid username
4. Submit form

**Assertions**:
- Server error message displayed
- User can retry
- Error logged appropriately

---

### TC-0-A006: Master Data Sync After Login
**Priority**: High  
**Automation Framework**: Playwright

**Test Steps**:
1. Complete authentication (mocked)
2. Intercept `/tenant/master` API
3. Verify subsequent data endpoint calls
4. Verify progress bar updates

**Assertions**:
- `/tenant/master` called after auth
- Individual endpoints called (locations, employees, etc.)
- Progress indicator visible during sync

---

### TC-0-A007: User Profile API Verification
**Priority**: Medium  
**Automation Framework**: Playwright

**Test Steps**:
1. Complete authentication
2. Intercept `/user/me` API
3. Verify user profile loaded

**Assertions**:
- API called with auth token
- Profile data displayed in UI
- User name visible after login

---

### TC-0-A008: Session Token Storage
**Priority**: Medium  
**Automation Framework**: Playwright

**Test Steps**:
1. Complete full login flow (mocked)
2. Check localStorage/sessionStorage
3. Verify token stored

**Assertions**:
- Auth token stored securely
- Token format valid
- Expiry handled correctly

---

## API Contract Tests

### TC-0-API001: /user/who Endpoint Contract
**Priority**: Critical  
**Automation Framework**: Playwright API

**Request**:
```json
{
  "username": "user@company.com"
}
```

**Expected Response (200)**:
```json
{
  "tenantId": "string",
  "tenantName": "string",
  "authProvider": "microsoft",
  "authConfig": {
    "clientId": "string",
    "redirectUri": "string"
  }
}
```

**Error Response (404)**:
```json
{
  "error": "USER_NOT_FOUND",
  "message": "string"
}
```

---

### TC-0-API002: /user/me Endpoint Contract
**Priority**: Critical  
**Automation Framework**: Playwright API

**Headers Required**:
- Authorization: Bearer {token}

**Expected Response (200)**:
```json
{
  "userId": "string",
  "email": "string",
  "name": "string",
  "role": "string",
  "tenantId": "string",
  "permissions": ["array"]
}
```

---

### TC-0-API003: /tenant/master Endpoint Contract
**Priority**: High  
**Automation Framework**: Playwright API

**Expected Response (200)**:
```json
{
  "endpoints": [
    { "name": "locations", "url": "/locations" },
    { "name": "sublocations", "url": "/sublocations" },
    { "name": "areas", "url": "/areas" },
    { "name": "employees", "url": "/employees" },
    { "name": "forms", "url": "/forms" }
  ]
}
```

---

## Data-Driven Tests

### TC-0-DD001: Username Format Validation
**Framework**: Playwright with test.each

| Username | Valid | Error Type |
|----------|-------|------------|
| `user@company.com` | ✓ | None |
| `user.name@company.com` | ✓ | None |
| `user+tag@company.com` | ✓ | None |
| `user@sub.company.com` | ✓ | None |
| `invalid` | ✗ | Format |
| `@company.com` | ✗ | Format |
| `user@` | ✗ | Format |
| `` (empty) | ✗ | Required |
| `   ` (spaces) | ✗ | Required |

---

## Test Implementation Notes

### Mocking Strategy
1. **Microsoft OAuth**: Always mock - external dependency
2. **Tenant Lookup**: Mock with various responses
3. **Master Data**: Mock with realistic sample data

### Environment Variables
```env
BASE_URL=https://wemine-office.example.com
MOCK_TENANT_ID=test-tenant-123
MOCK_USER_ID=test-user-456
```

### Setup/Teardown
- Clear localStorage before each test
- Reset network mocks
- Ensure clean login state
