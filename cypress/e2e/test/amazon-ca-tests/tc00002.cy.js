import { ShoppingCart } from '../../../pages/shopping-cart.cy';
import { Homepage } from '../../../pages/homepage.cy';
import { ProductListing } from '../../../pages/product-listing.cy';
import { Checkout } from '../../../pages/checkout.cy';
let shoppingCartPage = new ShoppingCart();
let homepage = new Homepage();
let productListingPage = new ProductListing();
let checkoutPage = new Checkout();

describe("TC00002", function() {
    // NOTE: beforeEach() is being used as both setup and teardown methods because there seems to be an issue with after() and afterEach()
    // Here's the open ticket for it in Github https://github.com/cypress-io/cypress/issues/2831
    beforeEach(() => {
        // Navigate to Amazon CA and Sign in
        homepage.navigate();
        homepage.signIn();

        // -- CLEAN UP --
        homepage.navigateHome();
        shoppingCartPage.navigate();

        // Check if the cart is empty, if not, delete the contents
        shoppingCartPage.checkEmptyCart();
    });

    it("Subtotal Calculation in Shopping Cart Page should result in correct calculation as Checkout page", function() {
        const numItems = Cypress.config('numItemsToAdd');
        const firstSubtotal = `$${Cypress.config('firstSubtotal')}`;
        const secondSubtotal = `$${Cypress.config('secondSubtotal')}`;
        const thirdSubtotal = `$${Cypress.config('thirdSubtotal')}`;
        const primaryProductASIN = Cypress.config('primaryProductASIN');
        const secondaryProductASIN = Cypress.config('secondaryProductASIN');

        // Iterations of adding items to cart and veerifying the subtotal in the shopping cart
        addToCartAndVerify(primaryProductASIN, numItems, numItems, firstSubtotal);
        addToCartAndVerify(primaryProductASIN, numItems, 2 * numItems, secondSubtotal);
        addToCartAndVerify(secondaryProductASIN, numItems, 3 * numItems, thirdSubtotal);
    });

    /**
     * Helper function for adding a product to the Shopping Cart and verifying whether the correct calculation is displayed.
     * @param {string} asin - Unique ID of an Amazon Product Listing
     * @param {number} numItems - Number of items to be added to the cart
     * @param {string} label - The name of the product
     * @param {string} subtotal - The expected subtotal after adding the product to the cart
     */
    function addToCartAndVerify(asin, numItems, label, subtotal) {
        // Add 2 Alexa Echo Dot
        productListingPage.addAlexaProductToCart(asin, numItems);

        // Navigate to Shopping Cart Page
        shoppingCartPage.navigate();

        // Verify First Subtotal Box
        shoppingCartPage.verifyBuyBoxLabel(label);
        shoppingCartPage.verifyBuyBoxSubtotal(subtotal);

        // Verify Second Subtotal Box
        shoppingCartPage.verifyActiveCartLabel(label);
        shoppingCartPage.verifyActiveCartSubtotal(subtotal);

        // Verify that the same subtotal and item count label is displayed at checkout
        checkoutPage.navigate();
        checkoutPage.verifyCheckout(label, subtotal)
        homepage.navigate();
    }
});