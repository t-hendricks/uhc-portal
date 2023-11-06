import Login from '../../pageobjects/login.page';
import ClusterListPage from '../../pageobjects/ClusterList.page';

Cypress.config({
  defaultCommandTimeout: 120000,
  pageLoadTimeout: 120000,
  viewportWidth: 1600,
  viewportHeight: 1080,
});

describe('Write ROSA Login cmd to file', { tags: ['fedramp'] }, () => {
  before(() => {
    if (Cypress.env('GOV_CLOUD')) {
      cy.visit('');
      Login.loginFedRamp(
        Cypress.env('TEST_WITHQUOTA_USER'),
        Cypress.env('TEST_WITHQUOTA_PASSWORD'),
      );
    } else {
      Login.loginCommercial(
        Cypress.env('TEST_WITHQUOTA_USER'),
        Cypress.env('TEST_WITHQUOTA_PASSWORD'),
      );
    }
    ClusterListPage.waitForDataReady();
    ClusterListPage.isCreateClusterBtnVisible();
  });

  it('Writes ROSA Login cmd to file', () => {
    cy.visit('/create/rosa/getstarted');
    cy.get('[role="status"]').should('not.exist');
    cy.get('[aria-label="Copyable ROSA login command"]').then(($elem) => {
      Cypress.env('TOKEN', $elem.val());
    });
  });
  it('prints ROSA Login cmd', () => {
    const newArr = Cypress.env('TOKEN').split('--token=');
    Cypress.env('TOKEN', newArr[1]);
    cy.log(Cypress.env('TOKEN'));
    cy.writeFile(`${Cypress.config('projectRoot')}/rosa-login-token.sh`, Cypress.env('TOKEN'));
  });
});
