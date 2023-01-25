/**
 * Page Object Model for Product Search.
 */
export class ProductSearch {

    navigate() {
        cy.get("#nav-cart").click();
    }

    enterUserEmail() {
        return cy.get('#ap_email').type(Cypress.config('userEmail'));
    }

    enterUserPassword() {
        return cy.get("#ap_password").type(Cypress.config('userPsw'));
    }

    submit() {
        cy.get("#signInSubmit").click();
    }

    selectProduct(productASIN) {
        cy.get(
            `[data-asin='${productASIN}'] > .sg-col-inner > .s-widget-container > .s-card-container > .a-spacing-base > .s-product-image-container > .rush-component > .a-link-normal > .a-section > .s-image`
        ).click();
    }
}