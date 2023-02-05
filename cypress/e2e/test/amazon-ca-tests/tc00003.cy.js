import { ShoppingCart } from '../../../pages/shopping-cart.cy';
import { Homepage } from '../../../pages/homepage.cy';
import { ProductListing } from '../../../pages/product-listing.cy';
import { Checkout } from '../../../pages/checkout.cy';
let shoppingCartPage = new ShoppingCart();
let homepage = new Homepage();
let productListingPage = new ProductListing();
let checkoutPage = new Checkout();

const numItems = Cypress.config('numItemsToAdd');
const primaryProductASIN = Cypress.config('primaryProductASIN');

describe("TC00003", function() {
    // NOTE: beforeEach() is being used as both setup and teardown methods because there seems to be an issue with after() and afterEach()
    // Here's the open ticket for it in Github https://github.com/cypress-io/cypress/issues/2831
    beforeEach(() => {
        // Navigate to Amazon CA and Sign in
        homepage.navigate();
        homepage.signIn();

        // -- CLEAN UP --
        shoppingCartPage.cartTeardown();

        // -- SETUP --
        // Add 2 Alexa Echo Dot as part of preamble
        productListingPage.addAlexaProductToCart(primaryProductASIN, numItems);
    });

    it("Subtotal Calculation after Changing Quantity in Shopping Cart should result in correct calculation as Checkout page", function() {
        const initSubtotal = Cypress.config('firstSubtotal'); // $109.98
        const nextSubtotal = Cypress.config('firstSubtotal') * 2; // $219.96
        const initQuantity = 2;
        const nextQuantity = initQuantity + 2;
        const initLabel = 2;
        const nextLabel = initLabel + 2;

        // Change the quantity from 2 to 4
        changeQuantityAndVerify(primaryProductASIN, nextQuantity, nextLabel, `$${nextSubtotal}`)
        // Change the quantity from 4 to 2
        changeQuantityAndVerify(primaryProductASIN, initQuantity, initLabel, `$${initSubtotal}`)
    });

    /**
     * Helper function for changing the quantity of a product in the Shopping Cart and verifying whether the correct calculation is displayed.
     * @param {string} asin - Unique ID of an Amazon Product Listing
     * @param {number} quantity - Number of items to be added to the cart
     * @param {string} label - The label on the buybox containing item quantity
     * @param {string} subtotal - The expected subtotal after the change in quantity
     */
    function changeQuantityAndVerify(asin, quantity, label, subtotal) {
        // Navigate to Shopping Cart
        shoppingCartPage.navigate();

        // Change Echo Dot (3rd Gen) product quantity from 2 to 4
        shoppingCartPage.setProductQuantity(asin, quantity);

        // Verify correct subtotal
        shoppingCartPage.verifyBuyBoxLabel(label);
        shoppingCartPage.verifyBuyBoxSubtotal(subtotal);
        shoppingCartPage.verifyActiveCartLabel(label);
        shoppingCartPage.verifyActiveCartSubtotal(subtotal);

        // Verify that the same subtotal and item count label is displayed at checkout
        checkoutPage.navigate();
        checkoutPage.verifyCheckout(quantity, subtotal)
    }
});
