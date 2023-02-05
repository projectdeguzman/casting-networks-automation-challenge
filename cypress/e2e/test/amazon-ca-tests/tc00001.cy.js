import { ShoppingCart } from '../../../pages/shopping-cart.cy';
import { Homepage } from '../../../pages/homepage.cy';
import { ProductListing } from '../../../pages/product-listing.cy';
import { AddedToCart } from '../../../pages/added-to-cart.cy';
import { Checkout } from '../../../pages/checkout.cy';

let shoppingCartPage = new ShoppingCart();
let homepage = new Homepage();
let productListingPage = new ProductListing();
let addedToCartPage = new AddedToCart();
let checkoutPage = new Checkout();

describe("TC00001", function() {
    // NOTE: beforeEach() is being used as both setup and teardown methods because there seems to be an issue with after() and afterEach()
    // Here's the open ticket for it in Github https://github.com/cypress-io/cypress/issues/2831
    beforeEach(() => {
        // Navigate to Amazon CA and Sign in
        homepage.navigate();
        homepage.signIn();

        // -- CLEAN UP --
        shoppingCartPage.cartTeardown();
    });

    it("Subtotal Calculation after Adding Item(s) to Cart should result in correct calculation as Checkout page", function() {
        const numItems = Cypress.config('numItemsToAdd');
        const firstSubtotal = `$${Cypress.config('firstSubtotal')}`;
        const secondSubtotal = `$${Cypress.config('secondSubtotal')}`;
        const thirdSubtotal = `$${Cypress.config('thirdSubtotal')}`;
        const primaryProductASIN = Cypress.config('primaryProductASIN');
        const secondaryProductASIN = Cypress.config('secondaryProductASIN');

        // Verify that subtotal is correct in the resulting page everytime items are added to the cart
        addToCartAndVerify(primaryProductASIN, numItems, numItems, firstSubtotal);
        addToCartAndVerify(primaryProductASIN, numItems, numItems * 2, secondSubtotal);
        addToCartAndVerify(secondaryProductASIN, numItems, numItems * 3, thirdSubtotal);
    });

    /**
     * Helper function for adding a product to the Shopping Cart and verifying the subtotal calculation.
     * @param {string} asin - Unique ID of an Amazon Product Listing
     * @param {number} numItems - Number of items to be added to the cart
     * @param {string} subtotal - The expected subtotal after adding the product to the cart
     */
    function addToCartAndVerify(asin, numItems, label, subtotal) {
        // Add product(s) to cart
        productListingPage.addAlexaProductToCart(asin, numItems);

        // Verify that the subtotal calculation is correct
        addedToCartPage.verifyBuyBoxSubtotal(subtotal)

        // Verify that the same subtotal and item count label is displayed at checkout
        checkoutPage.navigate();
        checkoutPage.verifyCheckout(label, subtotal)
        homepage.navigate();
    }
});
