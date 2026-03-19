# WeMine QA Test Cases

This repository contains comprehensive test cases for the WeMine application - a B2B SaaS product for mining site operations.

## Project Overview

WeMine helps people working in mining sites to:
- Record their activities
- Monitor equipment condition
- Report misconducts

### Platforms
- **Mobile App**: WeMine
- **Web App**: WeMineOffice
- **Backend Services**: Tenant, User, Notification, Equipment, Safety, Order, Workflow

## Repository Structure

```
├── case.md                              # Original case description
├── readme.md                            # This file
│
└── testcases/                           # All test-related content
    ├── readme.md                        # Test documentation & tool explanation
    │
    ├── manual/                          # Manual Test Cases
    │   ├── flow-0-signin.md
    │   ├── flow-1-equipment-inspection.md
    │   └── flow-2-safety-hazard.md
    │
    └── automation/                      # Automation Test Cases
        ├── docs/                        # Test case documentation
        │   ├── flow-0-signin.md
        │   ├── flow-1-equipment-inspection.md
        │   └── flow-2-safety-hazard.md
        │
        └── scripts/                     # Playwright automation framework
            ├── package.json
            ├── playwright.config.ts
            ├── README.md
            └── tests/
                ├── *.spec.ts            # Test specifications
                ├── fixtures/            # Test data & mocks
                ├── helpers/             # Utility functions
                └── pages/               # Page Object Model
```

## How to Read Test Results

Please refer to [testcases/readme.md](./testcases/readme.md) for detailed documentation on:
- Test case structure and format
- Tool selection rationale
- How to run automation tests
- How to interpret test results

## Quick Start - Running Automation Tests

```bash
# Navigate to automation scripts folder
cd testcases/automation/scripts

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Run all tests
npx playwright test

# Run with visible browser
npx playwright test --headed

# View test report
npx playwright show-report
```

## Test Coverage Summary

| Flow | Manual Test Cases | Automation Test Cases |
|------|------------------|----------------------|
| Flow 0 - Sign In | 12 cases | 8 cases |
| Flow 1 - Equipment Inspection | 18 cases | 10 cases |
| Flow 2 - Safety Hazard Report | 22 cases | 12 cases |

