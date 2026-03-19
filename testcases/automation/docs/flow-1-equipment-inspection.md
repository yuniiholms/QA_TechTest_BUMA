# Flow 1 - Equipment Inspection: Automation Test Cases

## Overview
Automated tests focus on form builder functionality (Web), dynamic form rendering, form validation, and submission flows. Critical for regression testing of the form system.

---

## Automation Strategy

### What to Automate:
- Form builder CRUD operations
- Dynamic form field rendering
- Form validation rules
- Submission API verification
- Field type behavior

### What NOT to Automate:
- Drag-and-drop UX (complex, use manual)
- Image capture on mobile (device-dependent)
- Visual form layout verification

---

## Form Builder Tests (Web)

### TC-1-A001: Create Form with Text Field
**Priority**: Critical  
**Automation Framework**: Playwright  
**File**: `tests/equipment-inspection.spec.ts`

**Test Steps**:
1. Login to WeMineOffice
2. Navigate to Form Builder
3. Create new form
4. Add Text field
5. Configure label and required flag
6. Save form
7. Verify form in list

**Assertions**:
- Form saved successfully
- Form appears in form list
- Text field configuration preserved

```typescript
test('create form with text field', async ({ page }) => {
  await loginAsAdmin(page);
  await page.goto('/form-builder');
  await page.click('[data-testid="new-form"]');
  await page.fill('[data-testid="form-name"]', 'Test Inspection Form');
  await page.click('[data-testid="add-field-text"]');
  await page.fill('[data-testid="field-label"]', 'Notes');
  await page.click('[data-testid="save-form"]');
  
  await expect(page.locator('text=Test Inspection Form')).toBeVisible();
});
```

---

### TC-1-A002: Create Form with All Field Types
**Priority**: Critical  
**Automation Framework**: Playwright

**Test Steps**:
1. Create new form
2. Add Text field
3. Add Date Picker field
4. Add Select field with options
5. Add Radio field with 4 options
6. Add Image Picker field
7. Save form

**Assertions**:
- All 5 field types added successfully
- Each field has correct configuration
- Form saves without error

---

### TC-1-A003: Form Field Limit Enforcement
**Priority**: High  
**Automation Framework**: Playwright

**Test Steps**:
1. Create new form
2. Add 50 fields via script
3. Attempt to add 51st field

**Assertions**:
- 50 fields added successfully
- 51st field blocked or error shown
- UI indicates limit reached

---

### TC-1-A004: Radio Field Maximum Options
**Priority**: Medium  
**Automation Framework**: Playwright

**Test Steps**:
1. Add Radio field to form
2. Add 4 options
3. Attempt to add 5th option

**Assertions**:
- 4 options added
- Add button disabled or error for 5th

---

### TC-1-A005: Edit Existing Form
**Priority**: High  
**Automation Framework**: Playwright

**Test Steps**:
1. Open existing form
2. Modify field label
3. Add new field
4. Remove a field
5. Save changes

**Assertions**:
- Changes persisted
- Form list shows updated timestamp

---

### TC-1-A006: Delete Form
**Priority**: Medium  
**Automation Framework**: Playwright

**Test Steps**:
1. Select existing form
2. Click delete
3. Confirm deletion

**Assertions**:
- Confirmation dialog appears
- Form removed from list
- Form code no longer available

---

## Dynamic Form Rendering Tests

### TC-1-A007: Form Loads Based on Form Code
**Priority**: Critical  
**Automation Framework**: Playwright

**Test Steps**:
1. Create two different forms
2. Start inspection with Form Code A
3. Verify fields match Form A
4. Start inspection with Form Code B
5. Verify fields match Form B

**Assertions**:
- Correct fields rendered for each form code
- No field mixing between forms

---

### TC-1-A008: Dynamic Form API Contract
**Priority**: High  
**Automation Framework**: Playwright API

**Endpoint**: `GET /forms/{formCode}`

**Expected Response**:
```json
{
  "formCode": "EQ-INSPECT-001",
  "formName": "Equipment Inspection",
  "fields": [
    {
      "id": "field1",
      "type": "text",
      "label": "Inspector Notes",
      "required": true
    },
    {
      "id": "field2",
      "type": "datepicker",
      "label": "Inspection Date",
      "required": true
    }
  ]
}
```

---

### TC-1-A009: Select Field Options Loading
**Priority**: High  
**Automation Framework**: Playwright

**Test Steps**:
1. Open form with Select field
2. Click Select field
3. Verify options loaded

**Assertions**:
- Options fetched from correct endpoint
- All options displayed
- Selection works correctly

---

## Form Validation Tests

### TC-1-A010: Required Field Validation - Text
**Priority**: High  
**Automation Framework**: Playwright

**Test Steps**:
1. Open form with required Text field
2. Leave field empty
3. Submit form

**Assertions**:
- Submission blocked
- Error message on field
- Focus moves to error field

---

### TC-1-A011: Required Field Validation - All Types
**Priority**: High  
**Automation Framework**: Playwright

**Test Data**:
| Field Type | Empty Value | Expected Error |
|------------|-------------|----------------|
| Text | "" | "This field is required" |
| Date Picker | null | "Please select a date" |
| Select | null | "Please select an option" |
| Radio | null | "Please select an option" |
| Image Picker | null | "Please add an image" |

---

### TC-1-A012: Text Field Character Limit
**Priority**: Medium  
**Automation Framework**: Playwright

**Test Steps**:
1. Open form with limited text field
2. Enter text at limit
3. Enter text over limit

**Assertions**:
- At limit: accepted
- Over limit: truncated or error

---

## Submission Tests

### TC-1-A013: Submit Valid Inspection
**Priority**: Critical  
**Automation Framework**: Playwright

**Test Steps**:
1. Open inspection form
2. Fill all fields with valid data
3. Submit inspection
4. Verify success

**Assertions**:
- API call made with correct payload
- Success message displayed
- Redirected to list
- New entry in submissions list

---

### TC-1-A014: Submission API Contract
**Priority**: Critical  
**Automation Framework**: Playwright API

**Endpoint**: `POST /inspections`

**Request Payload**:
```json
{
  "formCode": "EQ-INSPECT-001",
  "fields": [
    { "id": "field1", "value": "All good" },
    { "id": "field2", "value": "2026-03-19" }
  ],
  "images": [
    { "fieldId": "field5", "base64": "..." }
  ]
}
```

**Expected Response (201)**:
```json
{
  "inspectionId": "uuid",
  "createdAt": "ISO8601",
  "status": "submitted"
}
```

---

### TC-1-A015: View Submissions List
**Priority**: High  
**Automation Framework**: Playwright

**Test Steps**:
1. Navigate to Equipment Inspection
2. Verify list loads
3. Check pagination/infinite scroll

**Assertions**:
- List API called
- Submissions displayed
- Sorted by date (newest first)

---

### TC-1-A016: View Submission Details
**Priority**: Medium  
**Automation Framework**: Playwright

**Test Steps**:
1. Click on submission in list
2. Verify details page loads

**Assertions**:
- All field values displayed
- Images rendered
- Metadata visible (date, inspector)

---

## API Contract Tests

### TC-1-API001: GET /forms - List Forms
**Response**:
```json
{
  "forms": [
    { "formCode": "string", "formName": "string", "fieldCount": "number" }
  ]
}
```

### TC-1-API002: POST /forms - Create Form
**Request**:
```json
{
  "formName": "string",
  "fields": [{ "type": "string", "label": "string", "required": "boolean" }]
}
```

### TC-1-API003: PUT /forms/{formCode} - Update Form

### TC-1-API004: DELETE /forms/{formCode} - Delete Form

### TC-1-API005: GET /inspections - List Submissions

### TC-1-API006: GET /inspections/{id} - Get Submission Details

---

## Data-Driven Tests

### TC-1-DD001: Form Field Types Rendering
| Type | Test Data | Expected Behavior |
|------|-----------|-------------------|
| text | "Hello" | Text input displayed |
| datepicker | "2026-03-19" | Date picker opens |
| select | ["A","B","C"] | Dropdown with options |
| radio | ["Yes","No"] | Radio buttons |
| imagepicker | - | Camera/gallery trigger |

---

## Test Implementation Notes

### Fixtures
- Pre-created test forms
- Sample inspection data
- Test user with inspector role

### Cleanup
- Delete test forms after suite
- Clear test submissions

### Performance Considerations
- Form with 50 fields should render < 2s
- Submission should complete < 5s
