# QA Work Sample – Bulk Update Quantity (Cypress)

## Overview

This repository contains a Cypress end-to-end test that validates the bulk update quantity functionality in the eLabJournal sandbox environment.

The test covers a complete user workflow:

- Logging in
- Navigating to the "Inventory Browser"
- Selecting multiple samples
- Updating their quantity in bulk
- Verifying that the update is successfully processed

The focus of this work sample is test stability, realistic user interaction, and clear synchronization with backend behavior, rather than exhaustive UI coverage.

## Test Scope

The test verifies that:

- A user can select multiple samples from the "Inventory Browser"
- The "Sample quantity" bulk action opens correctly
- The quantity and unit can be updated using the "Update current quantity" option
- The backend mutation responsible for the update completes successfully
- A success confirmation is shown to the user

The test intentionally does not validate the exact quantity values in the table after the update, as the goal is to verify the bulk update logic and flow rather than table rendering or formatting.

## Key Design Decisions

### 1. Single end-to-end test

The entire workflow is covered in one test to reflect how a real user interacts with the system.

### 2. State-based synchronization (no hard waits)

The test avoids arbitrary waits and relies on:

- Presence of real data (sample rows)
- Visibility of interactive elements
- A backend network intercept for deterministic completion

This reduces flakiness and makes failures easier to diagnose.

### 3. Backend synchronization via cy.intercept

The GraphQL mutation responsible for updating sample quantities is intercepted and awaited before asserting UI feedback.

This ensures the test synchronizes on the actual backend operation, rather than relying solely on transient UI elements such as toast notifications.

### 4. Scoped selectors and test attributes

Where available, `data-test` attributes are used to create stable selectors that are resilient to UI or styling changes.

Interactions within the bulk update modal are scoped using `.within()` to clearly express intent and reduce selector ambiguity.

### 5. Shared sandbox considerations

The test operates on existing sandbox data and uses "Update current quantity" to avoid dependency on prior sample state.

This approach minimizes risk in a shared environment while still validating the bulk update functionality.

### 6. Focus on the dedicated "Sample quantity" bulk action

The application provides multiple UX paths for updating sample quantities (e.g. the dedicated "Sample quantity" action and a more generic "Edit field" action).

For this test, the dedicated "Sample quantity" action was chosen to keep the scope clear and directly aligned with the feature under test.

In a broader regression test suite, both paths could be covered separately.

### 7. Viewport configuration for test stability

The viewport width is increased during test execution to avoid responsive layout behavior in the Cypress runner.

This prevents UI elements from being hidden behind overflow menus and keeps the test focused on bulk-update logic rather than layout-specific behavior.

## Assumptions & Limitations

- The sandbox environment contains at least two samples
- Credentials are provided via Cypress environment variables
- The test updates shared sandbox data

In a production test suite, this test would likely be complemented by:

- Dedicated test sample setup (via API or Cypress)
- Cleanup or data isolation strategies

## How to Run

1. Install dependencies:

```bash
npm install
```

2. Run Cypress in interactive mode:

```bash
npm run cypress:open
```

This opens the Cypress Test Runner, where the test can be executed and debugged interactively.

3. Alternatively, run the test in headless mode:

```bash
npm test
```

This runs the test once in headless mode and exits, which is suitable for CI environments.

## Final Notes

This test was written as a focused example of how bulk quantity updates can be validated using Cypress in a shared sandbox environment.

Design choices such as scoped selectors, backend synchronization, and minimal reliance on UI text were made intentionally to keep the test stable and maintainable.

The test is meant to demonstrate approach and reasoning rather than exhaustive coverage of the application.