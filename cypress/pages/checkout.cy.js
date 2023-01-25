/**
 * Page Object Model for CheckoutPage. Contains selectors and helpers.
 */
export class Checkout {

    /**
     * Navigate the the checkout page.
     * @returns 
     */
    navigate() {
        return cy.get('#sc-buy-box-ptc-button').click();
    }

    verifyCheckout(expectedCount, subtotal) {
        return cy.get('#spc-order-summary #subtotals-marketplace-table tbody tr:nth-child(1)')
            .should('include.text', `Items (${expectedCount})`) // Verify Item Count Label
            .should('include.text', `${subtotal}`); // Verify Subtotal in Checkout
    }
}