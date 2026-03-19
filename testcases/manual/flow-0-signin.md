# Flow 0 - Sign In: Manual Test Cases

## Overview
Sign-in flow involves username lookup, Microsoft authentication, profile retrieval, and master data synchronization. Special attention needed for offline capability and first-time setup.

---

## Test Cases

### TC-0-001: Valid Login with Correct Credentials
**Priority**: Critical  
**Type**: Positive  
**Platform**: Both (Web & Mobile)

**Preconditions**:
- User has valid account in the system
- User's tenant is active and configured
- Network connection is available

**Test Steps**:
1. Open WeMine application (Mobile) or WeMineOffice (Web)
2. Enter valid username in username field
3. Wait for Microsoft login screen to appear
4. Enter correct password
5. Complete authentication

**Expected Results**:
- API call to `/user/who` returns tenant information
- Microsoft login screen displays correctly
- API call to `/user/me` returns user profile
- API call to `/tenant/master` returns master data list
- Progress bar shows during data sync
- User is redirected to home/dashboard after sync

**Test Data**:
- Username: `testuser@company.com`
- Password: `ValidPassword123!`

---

### TC-0-002: Invalid Username - Non-existent User
**Priority**: High  
**Type**: Negative  
**Platform**: Both

**Preconditions**:
- Network connection is available

**Test Steps**:
1. Open application
2. Enter non-existent username
3. Attempt to proceed

**Expected Results**:
- API call to `/user/who` returns 404 or appropriate error
- Error message displayed: "User not found" or similar
- Microsoft login screen does NOT appear
- User remains on login screen

**Test Data**:
- Username: `nonexistent@company.com`

---

### TC-0-003: Invalid Username - Wrong Format
**Priority**: High  
**Type**: Negative  
**Platform**: Both

**Preconditions**:
- Network connection is available

**Test Steps**:
1. Open application
2. Enter username with invalid format (no @ symbol)
3. Attempt to proceed

**Expected Results**:
- Client-side validation error displayed
- No API call made (or API returns validation error)
- Clear error message about email format

**Test Data**:
- Username: `invalidusername`
- Username: `user@`
- Username: `@company.com`

---

### TC-0-004: Invalid Password in Microsoft Login
**Priority**: High  
**Type**: Negative  
**Platform**: Both

**Preconditions**:
- User has valid account
- Network connection available

**Test Steps**:
1. Open application
2. Enter valid username
3. Wait for Microsoft login screen
4. Enter incorrect password
5. Attempt to authenticate

**Expected Results**:
- Microsoft shows "Invalid password" error
- User remains on Microsoft login screen
- Option to retry or reset password available
- No access granted to application

**Test Data**:
- Username: `testuser@company.com`
- Password: `WrongPassword123!`

---

### TC-0-005: Tenant Lookup API Failure
**Priority**: High  
**Type**: Negative  
**Platform**: Both

**Preconditions**:
- Valid user account exists
- Simulate `/user/who` endpoint failure

**Test Steps**:
1. Open application
2. Enter valid username
3. Trigger API failure scenario (network mock or server down)

**Expected Results**:
- Appropriate error message displayed
- Retry option available
- Application does not crash
- User can attempt login again after issue resolved

---

### TC-0-006: Master Data Sync Progress Display
**Priority**: Medium  
**Type**: Positive  
**Platform**: Both

**Preconditions**:
- User successfully authenticated
- Multiple master data endpoints to sync

**Test Steps**:
1. Complete authentication successfully
2. Observe master data sync process

**Expected Results**:
- Progress bar is visible during sync
- Progress percentage updates as endpoints are fetched
- Each category shows sync status (locations, sublocations, areas, employees, forms)
- No UI freeze during sync

---

### TC-0-007: First Time Login - Restart Prompt
**Priority**: High  
**Type**: Positive  
**Platform**: Both

**Preconditions**:
- New user account (never logged in before)
- Or existing user with cleared local data

**Test Steps**:
1. Login with credentials for first time
2. Wait for master data sync to complete
3. Observe restart prompt

**Expected Results**:
- Clear message prompting user to restart application
- Explanation of why restart is needed
- Restart button/action available
- Data persists after restart
- Subsequent logins do not require restart

---

### TC-0-008: Login with Inactive Tenant
**Priority**: High  
**Type**: Negative  
**Platform**: Both

**Preconditions**:
- User account exists
- User's tenant is deactivated/suspended

**Test Steps**:
1. Open application
2. Enter username of user with inactive tenant
3. Attempt to proceed

**Expected Results**:
- Clear error message about tenant status
- Contact information for support provided
- No access to application features

---

### TC-0-009: Session Persistence After App Restart
**Priority**: Medium  
**Type**: Positive  
**Platform**: Both

**Preconditions**:
- User has previously logged in successfully
- Master data was synced

**Test Steps**:
1. Close application completely
2. Reopen application
3. Observe session state

**Expected Results**:
- User session is restored (or token refresh occurs)
- No need to re-sync all master data
- Quick access to main features

---

### TC-0-010: Login in Offline Mode (After Initial Sync)
**Priority**: Critical  
**Type**: Positive  
**Platform**: Both

**Preconditions**:
- User has logged in before and synced master data
- Session token stored locally
- Device is offline

**Test Steps**:
1. Enable airplane mode / disconnect network
2. Open application
3. Attempt to use application

**Expected Results**:
- Application loads with cached data
- Offline indicator visible
- Core features accessible
- Data entry possible with local queue

---

### TC-0-011: First Login Attempt in Offline Mode
**Priority**: High  
**Type**: Negative  
**Platform**: Both

**Preconditions**:
- New device / cleared app data
- No network connection

**Test Steps**:
1. Ensure device is offline
2. Open application
3. Attempt to enter username

**Expected Results**:
- Clear error message about network requirement
- No crash or hang
- Retry option when network available

---

### TC-0-012: Concurrent Login on Multiple Devices
**Priority**: Medium  
**Type**: Edge Case  
**Platform**: Both

**Preconditions**:
- User has valid account
- Access to multiple devices

**Test Steps**:
1. Login on Device A
2. Login on Device B with same credentials
3. Observe behavior on both devices

**Expected Results**:
- Policy-dependent behavior (both active OR first session invalidated)
- No data corruption
- Clear notification if session is invalidated
- Consistent user experience

---

## Exploratory Testing Notes

### Areas to Explore:
1. **Network interruption during login** - What happens if connection drops mid-authentication?
2. **Very slow network** - Does timeout handling work correctly?
3. **Large master data set** - Performance with many locations/employees
4. **Special characters in username** - Unicode, spaces, special chars
5. **Browser compatibility** (Web) - Edge, Chrome, Firefox, Safari
6. **OS versions** (Mobile) - iOS 14+, Android 10+
7. **Microsoft MFA** - Multi-factor authentication flow
8. **Password expiration** - Handling of expired credentials
