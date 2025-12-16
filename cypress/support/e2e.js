// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Suppress known benign ResizeObserver warnings
//
// These errors are triggered by layout recalculations
// in data-heavy UI components (tables, bulk actions).
// They do not affect user behavior but cause Cypress
// to fail tests by default.
//
Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes('ResizeObserver loop')) {
    return false; // prevent Cypress from failing the test
  }
});