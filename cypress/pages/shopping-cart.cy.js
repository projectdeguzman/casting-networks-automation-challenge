/**
 * Page Object Model for ShoppingCart.
 */

import { Homepage } from "./homepage.cy";
const homepage = new Homepage();

export class ShoppingCart {

    navigate() {
        cy.visit(`${Cypress.config('amazonUrl')}/gp/cart/view.html?ref_=nav_cart`);
    }

    enterUserEmail() {
        return cy.get('#ap_email').type(Cypress.config('userEmail'));
    }

    enterUserPassword() {
        return cy.get("#ap_password").type(Cypress.config('userPsw'));
    }

    submit() {
        return cy.get("#signInSubmit").click();
    }

    verifyEmptyCart() {
        return cy.get('.sc-cart-header h1').should('contains.text', 'Your Amazon Cart is empty.');
    }

    removeExistingCartItems() {
        return cy.get(
            '#sc-active-cart > .a-cardui-body > #activeCartViewForm > [data-name="Active Items"] > .sc-list-item > .sc-list-item-content .a-row.sc-action-links [data-action="delete"]'
        ).click({ multiple: true });
    }

    verifyBuyBoxLabel(numberOfItems) {
        return cy.get("#sc-subtotal-label-buybox").should(($el) => {
            // Assertion
            expect($el.text().trim()).to.equal(
                "Subtotal (" + numberOfItems.toString() + " items):"
            );
        });
    }

    verifyBuyBoxSubtotal(subtotal) {
        return cy.get("#sc-subtotal-amount-buybox").should("include.text", subtotal.toString());
    }

    verifyActiveCartLabel(numberofItems) {
        return cy.get("#sc-subtotal-label-activecart").should(($el) => {
            // Assertion
            expect($el.text().trim()).to.equal(
                "Subtotal (" + numberofItems.toString() + " items):"
            );
        });
    }

    verifyActiveCartSubtotal(subtotal) {
        return cy.get("#sc-subtotal-amount-activecart").should("include.text", subtotal.toString());
    }

    getCartHeader() {
        return cy.get('.sc-cart-header h1');
    }

    checkEmptyCart() {
        this.getCartHeader().then(($header) => {
            // store the button's text
            const cartHeaderText = $header.text();
            // Check if text is NOT 'Cart Empty'
            if (!cartHeaderText.includes('Your Amazon Cart is empty.')) {
                // Remove existing products
                this.removeExistingCartItems();
            }
        })
    }

    cartTeardown() {
        // Navigate to Shopping Cart
        homepage.navigateHome();
        this.navigate();

        // Check if the cart is empty, if not, delete the contents
        this.checkEmptyCart();
    }

    setProductQuantity(asin, quantity) {
        cy.get(`[data-asin="${asin}"] #quantity`).select(quantity, { force: true });
    }

    getProductPrice(asin) {
        return cy.get(`[data-asin="${asin}"] .sc-item-price-block`).text();
    }
}