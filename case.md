# Project WeMine

WeMine is a b2b saas product that has purpose to help people that work in mining sites record their activities, equipment condition, and report some missconducts.

## Platform Detail

1. Mobile App is called WeMine
2. Web is called WeMineOffice
3. Backend Services are:
   - Tenant Service handle tenant related configurations
   - User Service handle user auth, registration, ect
   - Notification Service handle push notification, emails, webhook, ect
   - Equipment Service handle equipment assets related process
   - Safety Service handle safety related features
   - Order Service handle asset ordering features
   - Workflow Service handle all process flow

## Main feature and characteristic

1. Mobile and Web are built with goal of they can be operated fully even when having a bad internet connection or not having one at all
2. Application have a lot of forms that is dynamicly built using form builder from web

## Flow 0 - Sign in

1. Mobile and Web app both have username field
2. app will send api request to backend /user/who
3. backend will lookup their tenant informations
4. app will open a microsoft login screen to enter password
5. app will request for user profile to /user/me
6. app will request for list of master data /tenant/master
7. app will request data for each endpoint given with progress bar (locations, sublocations, areas, employees, forms, ect)
8. app will promp user to restart after updating their master data for the first time

## Flow 1 - Equipment Inspection Form

1. Web app have a form builder that have multiple type of fields, up to max of 50 fields:
   - Input Text
   - Input Date Picker
   - Input Select
   - Input Radio (up to four options)
   - Image Picker
2. App can open feature called `Equipment Inspection`, there will be list of previous submissions, and a button to redirect them to submission form that have fields:
   - Form Code
   - ... (dynamicly created for based on form code)

## Flow 2 - Safety Hazard Report

1. Mobile App have menu called `Hazard`, users can see lsit of hazard reports and report their findings by filling fields below:
   - Location - Select - Mandatory
   - Sublocation - Select - Mandatory
   - Area - Select - Mandatory
   - Area Description - Text - Optional
   - Evidence - Image Picker - Mandatory
   - PIC - Select - Mandatory - Preselect to reporter
2. On Submission, system will generate a hazard entry, and a followup task for it
3. PIC will have to received a notification for the followup task, while all people in the area receive notification for the hazard
4. PIC will have to go to location, fix the issue, and submit the followup task with information as follow:
   - Evidence - Image Picker
   - Resolution Date - DateTime picker - Mandatory
   - Co Observer - Select with a (+) button to add more select fields
5. Direct Supervisor of the area will receive notification for it

## What to do

1. Create cases for each flow, show us you can create a new repository to handle automation, and write few example for the most of importances.
2. Explain why you pick the test tools, write down your cases [here](./testcases/readme.md)
