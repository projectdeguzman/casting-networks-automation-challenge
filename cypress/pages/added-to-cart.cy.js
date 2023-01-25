/**
 * Page Object Model for page after adding items to cart. Contains selectors and helpers
 */
export class AddedToCart {

    /** 
     * Verify the label displayed in the buy box of the Shopping Cart page
     * @param {number} numberOfItems - The number of items in the cart
     */
    verifyBuyBoxLabel(numberOfItems) {
        cy.get('#sc-subtotal-label-buybox').should(($el) => {
            // Assertion
            expect($el.text().trim()).to.equal(
                "Subtotal (" + numberOfItems.toString() + " items):"
            );
        });
    }

    /**
     * Verify the subtotal displayed in the buy box of the Shopping Cart page
     * @param {string} subtotal - The expected subtotal
     */
    verifyBuyBoxSubtotal(subtotal) {
        cy.get('.a-price.sw-subtotal-amount > .a-offscreen').should('include.text', subtotal.toString());
    }

    /**
     * Verify the label displayed in the active cart of the Shopping Cart page
     * @param {number} numberofItems - The number of items in the cart
     */
    verifyActiveCartLabel(numberofItems) {
        cy.get('#sc-subtotal-label-activecart').should(($el) => {
            // Assertion
            expect($el.text().trim()).to.equal(
                "Subtotal (" + numberofItems.toString() + " items):"
            );
        });
    }

    /**
     * Verify the subtotal displayed in the active cart of the Shopping Cart page
     * @param {string} subtotal - The expected subtotal
     */
    verifyActiveCartSubtotal(subtotal) {
        cy.get('#sc-subtotal-amount-activecart').should('include.text', subtotal.toString());
    }
}