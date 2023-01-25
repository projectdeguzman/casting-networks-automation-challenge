const { defineConfig } = require("cypress");

module.exports = defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
        amazonUrl: 'https://amazon.ca',
        userEmail: '<enter-user-email>',
        userPsw: '<enter-useer-password>',
        primaryProductASIN: 'B07PDHT5XP',
        secondaryProductASIN: 'B08KJN3333',
        firstSubtotal: 109.98,
        secondSubtotal: 219.96,
        thirdSubtotal: 419.94,
        numItemsToAdd: 2,
        globalTimeout: 10000
    },
    reporter: 'junit',
    reporterOptions: {
        mochaFile: 'results/my-test-output-[hash].xml',
        toConsole: true,
    },
});