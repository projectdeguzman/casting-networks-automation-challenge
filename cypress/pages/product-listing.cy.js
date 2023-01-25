import { Homepage } from "./homepage.cy";
import { ProductSearch } from "./product-search.cy";
const homepage = new Homepage();
const productSearchPage = new ProductSearch();

export let productPrice;

/**
 * Page Object Model for Product Listing.
 */
export class ProductListing {

    setQuantity(amount) {
        cy.get("#quantity").select(amount.toString());
    }

    addToCart() {
        cy.get("#add-to-cart-button").click();
    }

    handleWarrantyPopup() {
        cy.wait(5000)
            .get(".a-button-close > .a-icon")
            .should("be.visible")
            .then(() => {
                cy.get(".a-button-close > .a-icon").click();
            });
    }

    getProductPrice() {
        cy.get('.a-offscreen').then(($price) => {
            productPrice = $price
        });
    }

    addAlexaProductToCart(asin, number) {
        const searchKeyword = 'alexa';

        // Enter "alexa" in search bar
        homepage.search(searchKeyword)

        // Select the Echo Dot (3rd Gen) item from search results
        productSearchPage.selectProduct(asin);

        // Retrieve product price from product listing as we know that this is the price that the user see's
        this.getProductPrice();

        // Click quantity and select 2
        this.setQuantity(number.toString());

        // Click Add to Cart
        this.addToCart();

        // Check if the Warranty Popup is displayed
        this.handleWarrantyPopup();
    }


}