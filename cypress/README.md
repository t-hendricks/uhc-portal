# Cypress tests

Cypress tests are stored in the `cypress/` directory. We use the "page objects" pattern, in `cypress/pageobjects` - these define selectors for various components.
Test cases are in `cypress/e2e`.

These instructions assume `yarn start` (or equivalent dev-env) is already running in another terminal.

You'll need credentials in environment variables - `CYPRESS_TEST_WITHQUOTA_USER` and `CYPRESS_TEST_WITHQUOTA_PASSWORD` (ask team members).

To launch the Cypress test runner:

```
yarn cypress-ui
```

To run Cypress in headless mode:

```
yarn cypress-headless
```

To execute a specific test in headless mode:

```
yarn cypress-headless --spec 'cypress/e2e/RosaClusterWizard.js'
```
