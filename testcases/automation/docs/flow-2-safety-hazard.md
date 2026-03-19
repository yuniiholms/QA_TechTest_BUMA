# Flow 2 - Safety Hazard Report: Automation Test Cases

## Overview
Automated tests focus on hazard report submission, dependent dropdown behavior, followup task workflow, and API contracts. Notification testing is primarily manual due to device dependencies.

---

## Automation Strategy

### What to Automate:
- Form field validation
- Dependent dropdown logic
- Hazard submission API
- Followup task completion
- Data integrity checks

### What NOT to Automate:
- Push notification delivery (device dependent)
- Image capture (device camera)
- Real notification timing

---

## Hazard Report Submission Tests

### TC-2-A001: Submit Hazard Report - Happy Path
**Priority**: Critical  
**Automation Framework**: Playwright  
**File**: `tests/safety-hazard.spec.ts`

**Test Steps**:
1. Login to application
2. Navigate to Hazard menu
3. Click new report button
4. Select Location
5. Select Sublocation
6. Select Area
7. Upload mock evidence image
8. Verify PIC preselected
9. Submit report

**Assertions**:
- All fields accept input
- PIC preselected to current user
- Submission API called with correct payload
- Success message displayed
- Report appears in list

```typescript
test('submit hazard report successfully', async ({ page }) => {
  await loginAs(page, 'fieldworker');
  await page.goto('/hazard');
  await page.click('[data-testid="new-report"]');
  
  await page.selectOption('[data-testid="location"]', 'loc-1');
  await page.selectOption('[data-testid="sublocation"]', 'subloc-1');
  await page.selectOption('[data-testid="area"]', 'area-1');
  
  // Mock image upload
  await page.setInputFiles('[data-testid="evidence"]', 'fixtures/hazard.jpg');
  
  // Verify PIC preselection
  await expect(page.locator('[data-testid="pic"]')).toHaveValue(/fieldworker/);
  
  await page.click('[data-testid="submit"]');
  await expect(page.locator('text=Report submitted')).toBeVisible();
});
```

---

### TC-2-A002: Dependent Dropdown - Sublocation Filters by Location
**Priority**: Critical  
**Automation Framework**: Playwright

**Test Steps**:
1. Open hazard form
2. Get initial sublocation options (should be empty/all)
3. Select Location A
4. Get sublocation options
5. Verify only Location A's sublocations shown

**Assertions**:
- API filters sublocations by location
- UI shows filtered options
- Previous selection cleared on location change

```typescript
test('sublocation filters by location', async ({ page }) => {
  await page.goto('/hazard/new');
  
  // Select Location A
  await page.selectOption('[data-testid="location"]', 'location-a');
  
  // Verify sublocation options
  const options = await page.locator('[data-testid="sublocation"] option').allTextContents();
  expect(options).toContain('Sublocation A1');
  expect(options).toContain('Sublocation A2');
  expect(options).not.toContain('Sublocation B1');
});
```

---

### TC-2-A003: Dependent Dropdown - Area Filters by Sublocation
**Priority**: Critical  
**Automation Framework**: Playwright

**Test Steps**:
1. Select Location
2. Select Sublocation
3. Verify Area options filtered

**Assertions**:
- Only relevant areas shown
- Changing sublocation resets area

---

### TC-2-A004: PIC Preselection to Current User
**Priority**: High  
**Automation Framework**: Playwright

**Test Steps**:
1. Login as User A
2. Open hazard form
3. Check PIC field value

**Assertions**:
- PIC field shows User A's name/ID
- Field is editable
- User can select different PIC

---

### TC-2-A005: PIC Change to Different User
**Priority**: High  
**Automation Framework**: Playwright

**Test Steps**:
1. Open hazard form
2. Change PIC to different user
3. Submit report
4. Verify submission data

**Assertions**:
- PIC value changed in payload
- Original PIC (reporter) not in PIC field
- Task assigned to selected PIC

---

## Form Validation Tests

### TC-2-A006: Required Fields Validation
**Priority**: High  
**Automation Framework**: Playwright

**Test Matrix**:
| Field | Leave Empty | Submit | Expected |
|-------|-------------|--------|----------|
| Location | ✓ | ✓ | Error shown |
| Sublocation | ✓ | ✓ | Error shown |
| Area | ✓ | ✓ | Error shown |
| Evidence | ✓ | ✓ | Error shown |
| PIC | ✓ | ✓ | Error shown |

---

### TC-2-A007: Optional Area Description
**Priority**: Medium  
**Automation Framework**: Playwright

**Test Steps**:
1. Fill all mandatory fields
2. Leave Area Description empty
3. Submit

**Assertions**:
- Submission successful without description
- No validation error

---

### TC-2-A008: Area Description with Content
**Priority**: Medium  
**Automation Framework**: Playwright

**Test Steps**:
1. Fill all mandatory fields
2. Add Area Description
3. Submit
4. Verify description saved

**Assertions**:
- Description included in API payload
- Description visible in report details

---

## Followup Task Tests

### TC-2-A009: Followup Task Created on Submission
**Priority**: Critical  
**Automation Framework**: Playwright API

**Test Steps**:
1. Submit hazard report
2. Query followup tasks API
3. Verify task created

**Assertions**:
- Task linked to hazard report
- Task assigned to PIC
- Task status is "pending"

---

### TC-2-A010: Complete Followup Task
**Priority**: Critical  
**Automation Framework**: Playwright

**Test Steps**:
1. Login as PIC
2. Navigate to assigned tasks
3. Open followup task
4. Upload evidence image
5. Set resolution date
6. Add co-observer
7. Submit completion

**Assertions**:
- All fields accept input
- Submission successful
- Task marked complete
- Hazard status updated

---

### TC-2-A011: Co-Observer Add Multiple
**Priority**: High  
**Automation Framework**: Playwright

**Test Steps**:
1. Open followup task
2. Click (+) to add co-observer
3. Select observer 1
4. Click (+) again
5. Select observer 2
6. Submit

**Assertions**:
- Multiple select fields added
- Both observers in payload
- No UI issues with multiple fields

---

### TC-2-A012: Resolution Date Cannot Be Future
**Priority**: Medium  
**Automation Framework**: Playwright

**Test Steps**:
1. Open followup task
2. Try to select future date

**Assertions**:
- Future dates disabled
- Or error on selection

---

## API Contract Tests

### TC-2-API001: POST /hazards - Submit Report
**Priority**: Critical

**Request**:
```json
{
  "locationId": "string",
  "sublocationId": "string",
  "areaId": "string",
  "areaDescription": "string|null",
  "evidence": "base64",
  "picId": "string"
}
```

**Response (201)**:
```json
{
  "hazardId": "uuid",
  "reportNumber": "HAZ-2026-0001",
  "createdAt": "ISO8601",
  "followupTaskId": "uuid"
}
```

---

### TC-2-API002: GET /hazards - List Reports
**Response**:
```json
{
  "hazards": [
    {
      "hazardId": "uuid",
      "reportNumber": "string",
      "location": "string",
      "area": "string",
      "status": "open|in_progress|resolved",
      "createdAt": "ISO8601"
    }
  ],
  "pagination": { "page": 1, "total": 100 }
}
```

---

### TC-2-API003: GET /hazards/{id} - Get Report Details
**Response**:
```json
{
  "hazardId": "uuid",
  "reportNumber": "string",
  "location": {},
  "sublocation": {},
  "area": {},
  "areaDescription": "string",
  "evidence": { "url": "string" },
  "pic": {},
  "reporter": {},
  "followupTask": {},
  "createdAt": "ISO8601"
}
```

---

### TC-2-API004: GET /locations - Dropdown Data
**Response**:
```json
{
  "locations": [
    { "id": "string", "name": "string" }
  ]
}
```

---

### TC-2-API005: GET /sublocations?locationId={id}
**Response**:
```json
{
  "sublocations": [
    { "id": "string", "name": "string", "locationId": "string" }
  ]
}
```

---

### TC-2-API006: GET /areas?sublocationId={id}
**Response**:
```json
{
  "areas": [
    { "id": "string", "name": "string", "sublocationId": "string" }
  ]
}
```

---

### TC-2-API007: POST /followup-tasks/{id}/complete
**Request**:
```json
{
  "evidence": "base64",
  "resolutionDate": "ISO8601",
  "coObservers": ["userId1", "userId2"]
}
```

**Response (200)**:
```json
{
  "taskId": "uuid",
  "status": "completed",
  "completedAt": "ISO8601"
}
```

---

### TC-2-API008: GET /employees - For PIC/Observer Selection
**Response**:
```json
{
  "employees": [
    { "id": "string", "name": "string", "department": "string" }
  ]
}
```

---

## Integration Tests

### TC-2-INT001: Hazard Report Full Flow
**Priority**: Critical

**Test Steps**:
1. Submit hazard report
2. Verify followup task created
3. Login as PIC
4. Complete followup task
5. Verify hazard resolved

**Assertions**:
- End-to-end flow works
- All statuses updated correctly
- Data consistency maintained

---

### TC-2-INT002: Dependent Data Integrity
**Priority**: High

**Test Steps**:
1. Create hazard for Area X
2. Verify location/sublocation/area hierarchy correct
3. Check supervisor mapping

**Assertions**:
- Correct supervisor assigned to area
- Notification would go to right person

---

## Data-Driven Tests

### TC-2-DD001: Location-Sublocation-Area Hierarchy
| Location | Valid Sublocations | Invalid Sublocations |
|----------|-------------------|----------------------|
| Site A | Plant 1, Plant 2 | Plant 3 (Site B) |
| Site B | Plant 3, Plant 4 | Plant 1 (Site A) |

---

## Performance Tests

### TC-2-PERF001: Large Location List Load Time
- 100+ locations should load < 2s
- Dropdown should not lag

### TC-2-PERF002: Multiple Image Upload
- Handle multiple evidence images
- Upload time reasonable

---

## Test Implementation Notes

### Fixtures
- Test locations, sublocations, areas
- Test employees
- Sample evidence images

### Mocking
- Notification services (verify call, not delivery)
- Image storage (use test bucket)

### Cleanup
- Delete test hazard reports
- Reset task statuses
