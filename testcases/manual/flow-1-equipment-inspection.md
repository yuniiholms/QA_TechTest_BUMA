# Flow 1 - Equipment Inspection Form: Manual Test Cases

## Overview
Equipment Inspection involves a dynamic form builder (Web) and form submission (Mobile/Web). Forms can have up to 50 fields with various field types. Critical for equipment tracking and compliance.

---

## Test Cases - Form Builder (Web Only)

### TC-1-001: Create Form with All Field Types
**Priority**: Critical  
**Type**: Positive  
**Platform**: Web

**Preconditions**:
- User logged in with form builder permissions
- Access to WeMineOffice form builder

**Test Steps**:
1. Navigate to Form Builder
2. Create new Equipment Inspection form
3. Add one field of each type:
   - Input Text
   - Input Date Picker
   - Input Select
   - Input Radio (4 options)
   - Image Picker
4. Save the form

**Expected Results**:
- All field types render correctly in builder
- Field configuration options available for each type
- Form saves successfully
- Form appears in form list

---

### TC-1-002: Form Field Limit - Maximum 50 Fields
**Priority**: High  
**Type**: Boundary  
**Platform**: Web

**Preconditions**:
- Access to form builder

**Test Steps**:
1. Create new form
2. Add 50 fields of various types
3. Attempt to add 51st field

**Expected Results**:
- 50 fields added successfully
- Clear warning/error when attempting to add 51st field
- Add button disabled or shows limit reached message
- Form with 50 fields saves and works correctly

---

### TC-1-003: Form Field Limit - Exactly 50 Fields
**Priority**: Medium  
**Type**: Boundary  
**Platform**: Web

**Preconditions**:
- Access to form builder

**Test Steps**:
1. Create form with exactly 50 fields
2. Save the form
3. Open form on mobile app
4. Submit inspection with all 50 fields filled

**Expected Results**:
- Form renders correctly on all platforms
- No performance issues
- All 50 field values saved correctly
- Submission successful

---

### TC-1-004: Radio Button - Maximum 4 Options
**Priority**: Medium  
**Type**: Boundary  
**Platform**: Web

**Preconditions**:
- Access to form builder

**Test Steps**:
1. Add Radio field to form
2. Configure with 4 options
3. Attempt to add 5th option

**Expected Results**:
- 4 options added successfully
- Cannot add more than 4 options
- Clear indication of limit

---

### TC-1-005: Edit Existing Form
**Priority**: High  
**Type**: Positive  
**Platform**: Web

**Preconditions**:
- Existing form in system
- Edit permissions

**Test Steps**:
1. Open existing form in builder
2. Modify field labels
3. Add new field
4. Remove existing field
5. Reorder fields
6. Save changes

**Expected Results**:
- All modifications saved
- Existing submissions not affected
- New submissions use updated form
- Version tracking if applicable

---

## Test Cases - Equipment Inspection Submission

### TC-1-006: Submit Inspection with Valid Data
**Priority**: Critical  
**Type**: Positive  
**Platform**: Both

**Preconditions**:
- User logged in
- At least one inspection form configured
- Equipment to inspect

**Test Steps**:
1. Navigate to Equipment Inspection feature
2. View list of previous submissions
3. Click button to create new submission
4. Select Form Code
5. Fill all required fields
6. Submit inspection

**Expected Results**:
- Form loads dynamically based on Form Code
- All fields render correctly
- Submission successful
- New entry appears in submission list
- Data stored correctly in backend

**Test Data**:
- Form Code: `EQ-INSPECT-001`
- Text Field: "All components functioning normally"
- Date: Current date
- Select: First option
- Radio: Option B
- Image: Valid equipment photo

---

### TC-1-007: View Previous Submissions List
**Priority**: High  
**Type**: Positive  
**Platform**: Both

**Preconditions**:
- User logged in
- Previous submissions exist

**Test Steps**:
1. Navigate to Equipment Inspection
2. View submissions list

**Expected Results**:
- List loads with all previous submissions
- Submissions sorted by date (newest first)
- Key information visible (date, form code, status)
- Pagination or infinite scroll for large lists
- Can open individual submission for details

---

### TC-1-008: Dynamic Form Loading by Form Code
**Priority**: Critical  
**Type**: Positive  
**Platform**: Both

**Preconditions**:
- Multiple form templates exist with different Form Codes

**Test Steps**:
1. Start new inspection submission
2. Select Form Code A
3. Observe form fields
4. Go back
5. Start new submission
6. Select Form Code B
7. Observe form fields

**Expected Results**:
- Form A loads correct fields for that template
- Form B loads different fields per its template
- No mixing of fields between forms
- Dynamic rendering is smooth

---

### TC-1-009: Required Field Validation
**Priority**: High  
**Type**: Negative  
**Platform**: Both

**Preconditions**:
- Form with required fields configured

**Test Steps**:
1. Open inspection form
2. Leave required fields empty
3. Attempt to submit

**Expected Results**:
- Submission blocked
- Clear error messages on required fields
- Scroll to first error if needed
- No partial submission occurs

---

### TC-1-010: Image Picker - Capture Photo
**Priority**: High  
**Type**: Positive  
**Platform**: Mobile

**Preconditions**:
- Camera permissions granted
- Form with Image Picker field

**Test Steps**:
1. Open inspection form
2. Tap Image Picker field
3. Select "Take Photo" option
4. Capture equipment photo
5. Confirm selection

**Expected Results**:
- Camera opens successfully
- Photo captured and displayed in form
- Image quality acceptable
- Can retake if needed
- Image included in submission

---

### TC-1-011: Image Picker - Select from Gallery
**Priority**: High  
**Type**: Positive  
**Platform**: Mobile

**Preconditions**:
- Gallery/Photos permissions granted
- Form with Image Picker field

**Test Steps**:
1. Open inspection form
2. Tap Image Picker field
3. Select "Choose from Gallery"
4. Select existing photo
5. Confirm selection

**Expected Results**:
- Gallery opens successfully
- Photo selected and displayed
- Can change selection
- Image included in submission

---

### TC-1-012: Date Picker - Valid Date Selection
**Priority**: Medium  
**Type**: Positive  
**Platform**: Both

**Preconditions**:
- Form with Date Picker field

**Test Steps**:
1. Open inspection form
2. Tap/click Date Picker field
3. Select date from calendar
4. Confirm selection

**Expected Results**:
- Calendar/date picker opens
- Date selection smooth
- Selected date displayed in correct format
- Date persists in form

---

### TC-1-013: Select Field - Option Selection
**Priority**: Medium  
**Type**: Positive  
**Platform**: Both

**Preconditions**:
- Form with Select field configured with options

**Test Steps**:
1. Open inspection form
2. Tap/click Select field
3. View options dropdown/modal
4. Select an option

**Expected Results**:
- All configured options visible
- Selection recorded correctly
- Dropdown closes after selection
- Selected value displayed

---

### TC-1-014: Offline Inspection Submission
**Priority**: Critical  
**Type**: Positive  
**Platform**: Both

**Preconditions**:
- User logged in and master data synced
- Device offline
- Form templates cached

**Test Steps**:
1. Enable airplane mode
2. Open Equipment Inspection
3. Create new submission
4. Fill all fields
5. Submit inspection
6. Re-enable network
7. Observe sync behavior

**Expected Results**:
- Form loads from cache
- Submission saved locally
- Clear indicator of pending sync
- Auto-sync when online
- No data loss

---

### TC-1-015: Inspection Submission with Large Image
**Priority**: Medium  
**Type**: Edge Case  
**Platform**: Both

**Preconditions**:
- Form with Image Picker
- High-resolution camera

**Test Steps**:
1. Capture high-resolution image (10MB+)
2. Include in inspection form
3. Submit inspection

**Expected Results**:
- Image compressed appropriately OR
- Clear error about file size
- Submission completes or fails gracefully
- No app crash

---

### TC-1-016: Cancel Inspection Mid-Form
**Priority**: Medium  
**Type**: Positive  
**Platform**: Both

**Preconditions**:
- Inspection form open with data entered

**Test Steps**:
1. Open inspection form
2. Fill several fields
3. Press back/cancel button

**Expected Results**:
- Confirmation dialog appears
- "Discard" option clears data
- "Save Draft" option if available
- No orphaned data

---

### TC-1-017: Form with Text Field Character Limit
**Priority**: Medium  
**Type**: Boundary  
**Platform**: Both

**Preconditions**:
- Text field with character limit configured

**Test Steps**:
1. Enter text up to character limit
2. Attempt to exceed limit

**Expected Results**:
- Character counter visible
- Cannot exceed limit OR warning displayed
- Submission works at limit

---

### TC-1-018: Multiple Inspections in Quick Succession
**Priority**: Medium  
**Type**: Stress  
**Platform**: Mobile

**Preconditions**:
- Field user inspecting multiple equipment items

**Test Steps**:
1. Complete inspection 1, submit
2. Immediately start inspection 2
3. Complete and submit
4. Repeat 5 times rapidly

**Expected Results**:
- All submissions saved correctly
- No data mixing between submissions
- Performance remains stable
- All entries appear in list

---

## Exploratory Testing Notes

### Areas to Explore:
1. **Form builder drag-and-drop** - Field reordering UX
2. **Form versioning** - What happens to old submissions when form changes?
3. **Field type conversion** - Can you change a text field to date picker?
4. **Copy/duplicate form** - Efficiency for similar forms
5. **Form preview** - Builder preview vs actual rendering
6. **Special characters in field labels** - Unicode support
7. **Very long form** - Scroll/navigation UX with 50 fields
8. **Form loading performance** - Time to render complex forms
9. **Image picker permissions denied** - Graceful handling
10. **Multiple image uploads** - If form has multiple image pickers
