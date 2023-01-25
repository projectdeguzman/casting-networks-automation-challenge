/**
 * Page Object Model for Homepage.
 */
export class Homepage {

    navigate() {
        cy.visit(Cypress.config('amazonUrl'), { timeout: Cypress.config('globalTimeout') });
    }

    navigateHome() {
        cy.get('#nav-logo').click();
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

    navigateToSignIn() {
        cy.get(
            "#nav-signin-tooltip > .nav-action-button > .nav-action-inner"
        ).click();
    }

    continueToPasswordEntry() {
        cy.get(".a-button-inner > #continue").click();
    }

    signIn() {
        this.navigateToSignIn();
        this.enterUserEmail();
        this.continueToPasswordEntry();
        this.enterUserPassword();
        this.submit();
    }

    search(searchKeyword) {
        cy.get("#twotabsearchtextbox").type(searchKeyword.toString());
        cy.get("#nav-search-submit-button").click();
    }
}