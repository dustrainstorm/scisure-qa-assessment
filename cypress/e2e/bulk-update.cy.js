// cypress/e2e/bulk-update.cy.js

// Single e2e test covering the full user workflow:
// login → inventory browser → select samples → bulk update quantity → verify result
describe("Bulk update of sample quantities", () => {
  const NEW_VALUE = 7;
  const NEW_UNIT = "µl"; // adjust if you pick a different unit

  it("updates the quantity of multiple selected samples", () => {
    // Visit the login page
    cy.visit("/login");

    // Enter username/email
    cy.get("#login_username")
      .should("be.visible")
      .type(Cypress.env("ELAB_USERNAME"));

    // Enter password
    cy.get("#login_password")
      .should("be.visible")
      .type(Cypress.env("ELAB_PASSWORD"));

    // Click login
    cy.get("#loginbutton")
      .click();

    // Open the Inventory menu
    cy.get("#btnInventory")
      .should("be.visible")
      .click();

    // Click Inventory Browser
    cy.get('#btnInventoryBrowser')
      .should("be.visible")
      .click();

    // Ensure at least two sample rows exist
    cy.get('[data-test="list-sample-entry"]')
      .should('have.length.greaterThan', 1);

    // Select the first two samples via their checkboxes
    cy.get('[data-test="list-sample-entry"]')
      .eq(0)
      .find('[data-test="checkbox-column"] input[type="checkbox"]')
      .check({ force: true });

    cy.get('[data-test="list-sample-entry"]')
      .eq(1)
      .find('[data-test="checkbox-column"] input[type="checkbox"]')
      .check({ force: true });

    // Open the "Sample quantity" bulk action
    cy.get('button[title="Sample quantity"]')
    .should('be.visible')
    .click();

    // Assert that the quantity update modal appears
    cy.get('[data-test="bulk-update-form-modal-content"]')
      .should('be.visible')
      .within(() => {
        // Select "Update current quantity"
        cy.get('[data-test="mutation-selector"]')
          .find('input[name="quantity.amount-mutation-action-selector"][value="SetMutationAction"]')
          .check({ force: true });

        // Enter quantity value
        cy.get('[data-test="quantity-amount"]')
          .clear()
          .type(NEW_VALUE);

        // Open the unit dropdown
        cy.get('[data-test="quantity-unit-selector"]')
          .click();
    });
    
    // Select the desired unit (rendered outside the modal)
    cy.get('.vs__dropdown-menu')
      .should('be.visible')
      .contains('.vs__dropdown-option', NEW_UNIT)
      .click();
    
    // Set up intercept for bulk quantity update mutation to ensure backend request completes
    cy.intercept('POST', '/api/graphql/internal', (req) => {
      if (req.body.operationName === 'setSamplesQuantity') {
        req.alias = 'updateQuantity';
      }
    });
    
    // Submit by pressing the Update button
    cy.get('[data-test="helix-modal-container"]')
      .find('[data-test="proceedBtn"]')
      .should('be.visible')
      .click();

    // Wait for backend mutation to complete
    cy.wait('@updateQuantity')
      .its('response.statusCode')
      .should('eq', 200);

    // Assert the toast success message appeared
    cy.get('.toast.success', { timeout: 10000 })
      .should('be.visible')

    });
});