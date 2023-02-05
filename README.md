# Requirements:
- Node v18.12.1 installed
- NPM 8.19.2 installed
- Replace `userEmail` and `userPsw` in `cypress.config.js` with your own credentials to run the tests.

# Installation:
- Navigate to the project root directory and run `npm install`

# Execution via Cypress UI
- Run `npx cypress open` in terminal
- In the resulting Cypress window, click E2E Testing, then click Chrome. This will bring up the project specs you can run. From here, choose which tests to run.

# Execution via terminal (this approach seems to be flaky)
- To execute all tests: `npm test`
- To execute single test: `npx cypress run --spec cypress/e2e/test/amazon-ca-tests/<test-spec-name>.cy.js`
- To execute custom tests: `npx cypress run --spec 'cypress/e2e/test/amazon-ca-tests/tc00001.cy.js, cypress/e2e/test/amazon-ca-tests/tc00003.cy.js, cypress/e2e/test/amazon-us-tests/*'`
	- essentially, we can use comma-separated globs to define different tests in a command line execution

# Notes:
- The internal state of the application (in this case of Amazon CA) could have been setup using API if we had access to it
- We could also have used Cypress App Actions by connecting our testing project to the application code
- beforeEach() is being used as both setup and teardown methods because there seems to be an issue with after() and afterEach() when used with Cypress. Here's the open ticket for it in Github https://github.com/cypress-io/cypress/issues/2831

# Assumptions:
- We are making an assumption here for simplicity's sake since some user's have 2-factor auth on their accounts. For this test, we are assuming 2-factor auth is disabled.
- The approach taken here also assumes that the error was not caused by the user's inputs.
- We are also making the assumption that there are tests in place for testing the subtotal when adding only 1 singular product since this is perceived as a bug that slipped through the cracks of the current ui automation framework. We're not going to add testing that in this challenge.
 - Since we don't have access to the API, we are not able to run these tests in parallel because that would require separate users created for each test running in parallel because we dont want the tests running in parallel to fight over the same data from the same user. Running in parallel would be much more achievable with API access because we would be able to call the Amazon API Endpoints to create users and set up the application's initial state for each test.
 - Use primary Alexa product as Echo Dot (3rd Gen), ASIN=B07PDHT5XP
 - Use secondary Alexa product as Echo Show 5 (2nd Gen), ASIN=B08KJN3333

# Approach:
- Our understanding of the problem is that the users are seeing some price inconsistencies in pages where subtotals are displayed and the checkout page.
- Based on our knowledge of the Amazon.ca website, we identified 3 areas in which subtotal can be found (add-to-cart resulting page, shopping cart page, checkout page)
- In this scenario, we identified 3 bugs and have filed 3 bug tickets. The corresponding Test Cases for each bug are provided as well.
- A UI Automation testing framework is implemented using Node, Javascript and Cypress.
- The Page Object Model pattern is followed.
- Cypress out of box retry and wait functionalities are in-use by default. Environment Variables are exposed to be able to configure these values.
- Utilizing the out-of-box default functionalities is a means to avoid re-inventing the wheel. Enabling environment variables allows for these out-of-box solutions to be configured.

# Results Reporting
- The test results for an execution is stored in `results/` directory in the project root.
- JUnit Reports is configured for the project and each spec file will generate its own results file using unique hash id
- The JUnit xml reports can be used and imported into Jenkins or Xray for tracking results
- The reports configuration can be found in cypress.config.js

# Filed bugs for case study
##### BUG #1: Subtotal price after adding item(s) to cart does not display the correct subtotal calculation as Checkout page #####
    Steps to reproduce:
        1. Launch browser of choice
        2. Navigate to amazon.ca
        3. Search for alexa products
        4. Choose "Echo Dot (3rd Gen)"
        5. Set Quantity to 2 and click "Add to Cart" (2 * $54.99 = $109.98)
            EXPECTED OUTCOME: Subtotal in resulting page should display correct expected subtotal calculation ($109.98)) 
            ACTUAL OUTCOME: Resulting page subtotal calculation is incorrect
        6. Navigate to Checkoutpage and Verify subtotal calculation
            EXPECTED OUTCOME: Subtotal in checkout page should display correct expected subtotal calculation ($109.98)) 
            ACTUAL OUTCOME: Checkout page subtotal calculation is incorrect

##### BUG #2: Subtotal price in Shopping Cart page does not display the correct subtotal calculation as Checkout page #####
    Steps to reproduce:
        1. Launch browser of choice
        2. Navigate to amazon.ca
        3. Search for alexa products
        4. Choose "Echo Dot (3rd Gen)"
        5. Set Quantity to 2 and click "Add to Cart" (2 * $54.99 = $109.98)
        6. Navigate to Shopping Cart
            EXPECTED OUTCOME: Subtotal in Shopping Cart page should display correct expected subtotal calculation ($109.98)
            ACTUAL OUTCOME: Shopping Cart page subtotal calculation is incorrect
        7. Navigate to Checkoutpage and Verify subtotal calculation
            EXPECTED OUTCOME: Subtotal in checkout page should display correct expected subtotal calculation ($109.98)) 
            ACTUAL OUTCOME: Checkout page subtotal calculation is incorrect

##### BUG #3: Changing Quantity in Shopping Cart does not result in the correct cart subtotal price calculation as Checkout page #####
    Preamble:
	    - User already has 2 x Echo Dot (3rd Gen) in the cart and the correct subtotal is displayed ($109.98)
    Steps to reproduce:
        1. Launch browser of choice
        2. Navigate to amazon.ca
        3. Navigate to Shopping Cart
        4. Set Quantity from 2 to 4
            EXPECTED OUTCOME: Cart Subtotal automatically updates and displays correct calculation ($219.96)
            ACTUAL OUTCOME: Cart subtotal updates but incorrect calculation is displayed
        5. Navigate to Checkoutpage and Verify subtotal calculation
            EXPECTED OUTCOME: Subtotal in checkout page should display correct expected subtotal calculation ($109.98)) 
            ACTUAL OUTCOME: Checkout page subtotal calculation is incorrect

# Test cases created from bugs
##### TC00001: Subtotal Calculation after Adding Item(s) to Cart should result in correct calculation as Checkout page #####
    Preamble:
    1. User has access to a web browser
    2. User has internet connection

    Test Steps:
    1. Launch browser of choice
    2. Navigate to amazon.ca
    3. Search for alexa products
    4. Choose "Echo Dot (3rd Gen)"
    5. Set Quantity to 2 and click "Add to Cart"
    6. Verify that the subtotal in the resulting page displays the correct calculation ($109.98)
    7. Repeat steps 3 to 5
    8. Verify that the subtotal in the resulting page displays the correct calculation ($219.96)

    Expected Outcome(s):
    - The subtotal should correctly display the expected calculation after adding item(s) to cart and in the Checkout page.

    Actual Outcome(s):
    - The subtotal is incorrect in the resulting page and in the Checkout page.

##### TC00002: Subtotal Calculation in Shopping Cart Page should result in correct calculation as Checkout page #####
    Preamble:
    1. User has access to a web browser
    2. User has internet connection

    Test Steps:
    1. Launch browser of choice
    2. Navigate to amazon.ca
    3. Search for alexa products
    4. Choose "Echo Dot (3rd Gen)"
    5. Set Quantity to 2 and click "Add to Cart"
    6. Navigate to Shopping Cart
    7. Verify that the subtotal in the Shopping Cart page displays the correct calculation ($109.98)
    8. Navigate to Checkout page and verify that subtotals are correctly displayed
    8. Repeat steps 3 to 5
    9. Navigate to Shopping Cart
    10. Verify that the subtotal in the Shopping Cart page displays the correct calculation ($219.96)
    11. Navigate to Checkout page and verify that subtotals are correctly displayed

    Expected Outcome(s):
    - The subtotal should correctly display the expected calculation in the Shopping Cart page and in the Checkout page.

    Actual Outcome(s):
    - The subtotal is incorrect in the Shopping Cart page and in the Checkout page.

##### TC00003: Subtotal Calculation after Changing Quantity in Shopping Cart should result in correct calculation as Checkout page ######
    Preamble:
    1. User has access to a web browser
    2. User has internet connection
    3. User has 2 x Echo Dot (3rd Gen) in the cart and the correct subtotal is displayed ($109.98)

    Test Steps:
    1. Launch browser of choice
    2. Navigate to amazon.ca
    3. Navigate to Shopping Cart
    4. Set Quantity from 2 to 4
    5. Verify that the cart subtotal automatically updates and displays the correct calculation ($219.96)
    6. Navigate to Checkout page and verify that subtotals are correctly displayed
    7. Set Quantity from 4 back to 2
    8. Verify that the cart subtotal automatically updates and displays the correct calculation ($109.98)
    9. Navigate to Checkout page and verify that subtotals are correctly displayed

    Expected Outcome(s):
    - The cart subtotal should automatically update and display the correct calculation after changing the quantity in the Shopping Cart and in the Checkout page.

    Actual Outcome(s):
    - The cart subtotal updates but an incorrect calculation is displayed and in the Checkout page.


# Project Structure:
- `e2e/pages` directory contains the class pages following the page object model for amazon application
- `test/amazon-ca-test` directory contains the tests for Amazon CA. Other `/amazon-xx-tests` can be created for other Amazon environments, `/amazon-us-tests` directory is created for the purpose of demonstrating that.
- `cypress.config.js` contains most of the configurable environment variables to allow for customization of the test suite (change in product, price, quantity)

# Test Plan:
- I would assume that if this bug was captured, and this seems to be a critical issue because Amazon is losing sales, so we have to put this at the highest priority.
- We would allocate our resources for analyzing the test results for the next hotfix release (should be ASAP)
- We need to perform regression on the afflicted areas, which would be shopping cart, checkout, added to cart pages. We need to run the tests in those areas.
- The resource would need to ensure that the new test cases for the bugs are executed accordingly.
- We also want to ensure coverage for multiple OS & browsers. For that we could probably use BrowserStack for cross-browser testing.
- All of this is a collaboration between product, dev, devops and qe/qa teams to ensure that the release of the hotfix is a success and all environments are passing in the automation test suites
- The test executions can be tracked in Xray, where we can have a test plan for this release, and the test plan will have test executions for each combibation of browsers and environments. This is how we can track it's progress.

# Other approaches:
- Another approach to test this scenario would be using API tests rather than UI tests to check whether the price calculation from the server returns the correct result
    - We can use a combination of RestAssured, Groovy/Java and TestNG for the testing framework
- Using unit tests, we could also add another layer of testing for the subtotal before it even gets sent out
- Visual Validation could also be utilized to automate testing of the subtotal
    - Using Cypress, Javascript, Percy (or Applitools Eyes) for UX automation
