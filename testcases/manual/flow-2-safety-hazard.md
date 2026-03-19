# Flow 2 - Safety Hazard Report: Manual Test Cases

## Overview
Safety Hazard Report is a critical flow for mining site safety. Involves hazard reporting, notification system, followup tasks, and supervisor notifications. High priority due to safety implications.

---

## Test Cases - Hazard Report Submission

### TC-2-001: Submit Hazard Report with All Mandatory Fields
**Priority**: Critical  
**Type**: Positive  
**Platform**: Mobile

**Preconditions**:
- User logged in
- Master data synced (locations, sublocations, areas, employees)
- Camera access granted

**Test Steps**:
1. Open Hazard menu from main navigation
2. View list of existing hazard reports
3. Tap "Report Hazard" or equivalent button
4. Fill all fields:
   - Location: Select from dropdown
   - Sublocation: Select from filtered dropdown
   - Area: Select from filtered dropdown
   - Evidence: Capture photo of hazard
   - PIC: Verify preselected to reporter, change if needed
5. Submit report

**Expected Results**:
- Form opens with PIC preselected to current user
- Dependent dropdowns filter correctly
- Evidence photo captured successfully
- Submission successful
- Hazard entry created in system
- Followup task generated automatically
- New report visible in hazard list

**Test Data**:
- Location: "Mining Site A"
- Sublocation: "Processing Plant"
- Area: "Crusher Section"
- Evidence: Clear photo of hazard
- PIC: Current user (preselected)

---

### TC-2-002: Submit Hazard Report with Optional Area Description
**Priority**: High  
**Type**: Positive  
**Platform**: Mobile

**Preconditions**:
- Same as TC-2-001

**Test Steps**:
1. Open hazard report form
2. Fill all mandatory fields
3. Fill optional Area Description field with detailed text
4. Submit report

**Expected Results**:
- Area Description saved with report
- Description visible in hazard detail view
- No character limit issues (or clear limit if exists)

**Test Data**:
- Area Description: "Spill near conveyor belt junction, approximately 2 meters from main walkway. Requires immediate cleanup due to slip hazard."

---

### TC-2-003: Mandatory Field Validation - Missing Location
**Priority**: High  
**Type**: Negative  
**Platform**: Mobile

**Preconditions**:
- Hazard report form open

**Test Steps**:
1. Leave Location field empty
2. Fill all other mandatory fields
3. Attempt to submit

**Expected Results**:
- Submission blocked
- Error message on Location field
- Clear indication of required field
- Form remains open for correction

---

### TC-2-004: Mandatory Field Validation - Missing Evidence
**Priority**: High  
**Type**: Negative  
**Platform**: Mobile

**Preconditions**:
- Hazard report form open

**Test Steps**:
1. Fill all fields except Evidence
2. Attempt to submit

**Expected Results**:
- Submission blocked
- Error indicating evidence photo required
- Clear guidance to capture photo

---

### TC-2-005: Dependent Dropdown - Sublocation Filtering
**Priority**: High  
**Type**: Positive  
**Platform**: Mobile

**Preconditions**:
- Multiple locations with different sublocations configured

**Test Steps**:
1. Open hazard report form
2. Select Location A
3. Open Sublocation dropdown
4. Note available options
5. Change to Location B
6. Open Sublocation dropdown again

**Expected Results**:
- Sublocation shows only items belonging to selected Location
- Changing Location clears/resets Sublocation
- No sublocations from wrong location shown

---

### TC-2-006: Dependent Dropdown - Area Filtering
**Priority**: High  
**Type**: Positive  
**Platform**: Mobile

**Preconditions**:
- Multiple sublocations with different areas configured

**Test Steps**:
1. Select Location
2. Select Sublocation A
3. View Area options
4. Change to Sublocation B
5. View Area options again

**Expected Results**:
- Area shows only items belonging to selected Sublocation
- Changing Sublocation clears/resets Area
- Correct area options displayed

---

### TC-2-007: PIC Field - Preselection Verification
**Priority**: High  
**Type**: Positive  
**Platform**: Mobile

**Preconditions**:
- User logged in as "John Doe"

**Test Steps**:
1. Open hazard report form
2. Observe PIC field value

**Expected Results**:
- PIC field preselected with current user name
- User can see they are assigned as PIC
- Field is editable to select different PIC

---

### TC-2-008: PIC Field - Change to Different Person
**Priority**: Medium  
**Type**: Positive  
**Platform**: Mobile

**Preconditions**:
- Hazard report form open
- Multiple employees in system

**Test Steps**:
1. Open hazard form
2. View preselected PIC (self)
3. Tap PIC field
4. Select different employee
5. Submit report

**Expected Results**:
- PIC selection opens employee list
- Can select different person
- Selected person receives PIC notification (not reporter)
- Followup task assigned to selected PIC

---

## Test Cases - Notification System

### TC-2-009: PIC Notification for Followup Task
**Priority**: Critical  
**Type**: Positive  
**Platform**: Mobile

**Preconditions**:
- Hazard report submitted successfully
- PIC is different user (or test with two accounts)

**Test Steps**:
1. Submit hazard report with specific PIC
2. Login as PIC user on different device
3. Check notifications

**Expected Results**:
- PIC receives push notification
- Notification mentions followup task
- Tapping notification opens relevant task
- Notification received within reasonable time (< 1 min)

---

### TC-2-010: Area Notification - All People in Area
**Priority**: High  
**Type**: Positive  
**Platform**: Mobile

**Preconditions**:
- Multiple users associated with same area
- Hazard report submitted for that area

**Test Steps**:
1. Submit hazard report for Area X
2. Check notifications for all users associated with Area X

**Expected Results**:
- All area users receive notification
- Notification informs about hazard in their area
- Clear hazard details in notification
- Users can view hazard report

---

### TC-2-011: Notification - Offline User Receives on Reconnect
**Priority**: Medium  
**Type**: Edge Case  
**Platform**: Mobile

**Preconditions**:
- PIC user is offline when hazard submitted

**Test Steps**:
1. PIC goes offline
2. Reporter submits hazard report
3. PIC comes online

**Expected Results**:
- PIC receives notification upon reconnect
- No notification lost
- Task still accessible

---

## Test Cases - Followup Task Completion

### TC-2-012: Complete Followup Task with All Fields
**Priority**: Critical  
**Type**: Positive  
**Platform**: Mobile

**Preconditions**:
- Followup task assigned to user
- User is the PIC

**Test Steps**:
1. View assigned followup task
2. Go to hazard location physically
3. Resolve the issue
4. Open followup task form
5. Fill all fields:
   - Evidence: Photo of resolved issue
   - Resolution Date: Current date/time
   - Co Observer: Add at least one
6. Submit followup

**Expected Results**:
- Followup form loads correctly
- Evidence captured successfully
- Resolution Date picker works
- Co Observer field allows adding multiple
- Submission successful
- Task marked as complete
- Supervisor notified

---

### TC-2-013: Co Observer - Add Multiple Observers
**Priority**: High  
**Type**: Positive  
**Platform**: Mobile

**Preconditions**:
- Followup task form open

**Test Steps**:
1. Open Co Observer field
2. Select first observer
3. Tap (+) button to add more
4. Add second observer
5. Add third observer
6. Submit followup

**Expected Results**:
- (+) button adds new select field each time
- Multiple observers can be selected
- All observers saved with submission
- No limit issues (or clear limit if exists)

---

### TC-2-014: Co Observer - Remove Added Observer
**Priority**: Medium  
**Type**: Positive  
**Platform**: Mobile

**Preconditions**:
- Multiple co-observers added

**Test Steps**:
1. Add 3 co-observers
2. Remove middle observer
3. Submit followup

**Expected Results**:
- Remove/delete option available
- Observer removed from list
- Remaining observers intact
- Submission successful

---

### TC-2-015: Resolution Date - Cannot Select Future Date
**Priority**: Medium  
**Type**: Negative  
**Platform**: Mobile

**Preconditions**:
- Followup task form open

**Test Steps**:
1. Tap Resolution Date field
2. Attempt to select future date

**Expected Results**:
- Future dates disabled/blocked
- Error message if future date selected
- Only past and current date/time allowed

---

### TC-2-016: Resolution Date - DateTime Selection
**Priority**: Medium  
**Type**: Positive  
**Platform**: Mobile

**Preconditions**:
- Followup task form open

**Test Steps**:
1. Tap Resolution Date field
2. Select date
3. Select time

**Expected Results**:
- Date picker appears
- Time picker appears (or combined datetime)
- Both date and time saved
- Format displayed correctly

---

## Test Cases - Supervisor Notification

### TC-2-017: Direct Supervisor Notification on Followup Completion
**Priority**: Critical  
**Type**: Positive  
**Platform**: Mobile

**Preconditions**:
- Area has direct supervisor configured
- Followup task completed

**Test Steps**:
1. Complete followup task
2. Check notifications for area's direct supervisor

**Expected Results**:
- Supervisor receives notification
- Notification mentions followup completion
- Can view hazard and resolution details
- Notification timely (< 1 min)

---

### TC-2-018: Supervisor Not Notified Until Followup Complete
**Priority**: High  
**Type**: Negative  
**Platform**: Mobile

**Preconditions**:
- Hazard submitted but followup not complete

**Test Steps**:
1. Submit hazard report
2. Check supervisor notifications immediately

**Expected Results**:
- Supervisor does NOT receive notification yet
- Only PIC and area members notified at this stage

---

## Test Cases - Offline Scenarios

### TC-2-019: Submit Hazard Report Offline
**Priority**: Critical  
**Type**: Positive  
**Platform**: Mobile

**Preconditions**:
- User logged in with synced data
- Device offline

**Test Steps**:
1. Enable airplane mode
2. Open Hazard menu
3. Create new hazard report
4. Fill all fields with cached data
5. Submit report
6. Re-enable network

**Expected Results**:
- Form works with cached location data
- Submission saved locally
- Pending indicator shown
- Auto-syncs when online
- Notifications sent after sync

---

### TC-2-020: Complete Followup Task Offline
**Priority**: Critical  
**Type**: Positive  
**Platform**: Mobile

**Preconditions**:
- Followup task assigned
- Device offline

**Test Steps**:
1. Go offline
2. Open followup task
3. Complete and submit
4. Go online

**Expected Results**:
- Task completion saved locally
- Syncs when online
- Supervisor notification sent after sync

---

### TC-2-021: View Hazard List Offline
**Priority**: High  
**Type**: Positive  
**Platform**: Mobile

**Preconditions**:
- Previously synced hazard data
- Device offline

**Test Steps**:
1. Go offline
2. Open Hazard menu
3. View hazard list

**Expected Results**:
- Cached hazard reports visible
- Can view details of cached items
- Clear offline indicator
- Cannot see reports added by others while offline

---

## Test Cases - Edge Cases

### TC-2-022: Submit Hazard for Area with No Other Users
**Priority**: Low  
**Type**: Edge Case  
**Platform**: Mobile

**Preconditions**:
- Area exists with only one user

**Test Steps**:
1. Submit hazard for low-population area
2. Check notification behavior

**Expected Results**:
- Report submits successfully
- PIC notification sent
- No errors from empty area notification list

---

## Exploratory Testing Notes

### Areas to Explore:
1. **Photo quality requirements** - Is there minimum resolution?
2. **Location GPS integration** - Auto-detect location?
3. **Hazard severity levels** - Are there priority categorizations?
4. **Followup task deadlines** - SLA for resolution?
5. **Notification preferences** - Can users mute certain notifications?
6. **Hazard history/audit trail** - Who edited what when?
7. **Duplicate hazard detection** - Same location, same time?
8. **Escalation paths** - What if PIC doesn't respond?
9. **Evidence photo editing** - Can photos be cropped/annotated?
10. **Batch followup completion** - Multiple tasks at once?
11. **Co-observer notification** - Do they get notified?
12. **Supervisor hierarchy** - Multiple levels of supervisors?
