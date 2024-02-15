const { defineConfig } = require('cypress');

module.exports = defineConfig({
  chromeWebSecurity: false,
  defaultCommandTimeout: 10000,
  responseTimeout: 60000,
  env: {
    grepOmitFiltered: true,
    grepFilterSpecs: true,
  },
  e2e: {
    baseUrl: "https://prod.foo.redhat.com:1337/openshift",
    setupNodeEvents(on, config) {
      // implement node event listeners here
      require('@cypress/grep/src/plugin')(config);
      require('@cypress/code-coverage/task')(on, config);
      return config;
    },
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
    testIsolation: false,
  },
  retries: {
    // Configure retry attempts for CI `cypress run`
    // Default is 0
    runMode: 2,
    // Configure retry attempts for cypress-ui `cypress open`
    // Default is 0
    openMode: 0,
  },
});
