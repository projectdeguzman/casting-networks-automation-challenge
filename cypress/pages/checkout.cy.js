/**
 * Page Object Model for CheckoutPage. Contains selectors and helpers.
 */
export class Checkout {

    /**
     * Navigate the the checkout page.
     * @returns {Cypress.Chainable} - Chainable object representing the DOM element matching the selector
     */
    navigate() {
        return cy.get('#sc-buy-box-ptc-button').click();
    }

     /**
     * Verify the expected item count and subtotal in the checkout page
     * @function
     * @param {number} expectedCount - The expected number of items in the order
     * @param {number} subtotal - The expected subtotal of the order
     * @return {Cypress.Chainable} - Chainable object representing the DOM element matching the selector
     */
    verifyCheckout(expectedCount, subtotal) {
        return cy.get('#spc-order-summary #subtotals-marketplace-table tbody tr:nth-child(1)')
            .should('include.text', `Items (${expectedCount})`) // Verify Item Count Label
            .should('include.text', `${subtotal}`); // Verify Subtotal in Checkout
    }
}
