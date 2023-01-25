import Login from '../pageobjects/login.page';
import TokenPages from '../pageobjects/Tokens.page';
import ClusterListPage from '../pageobjects/ClusterList.page';

describe('Token pages', () => {
  beforeEach(() => {
    cy.visit('/');
    Login.isLoginPageUrl();
    Login.login();

    ClusterListPage.isClusterListUrl();
    ClusterListPage.waitForDataReady();
  });

  it('ocm-cli token page', () => {
    TokenPages.navigateToOCMToken();
    cy.get('.pf-c-spinner').should('not.exist');
    cy.get('h1').scrollIntoView().contains('OpenShift Cluster Manager API Token').should('be.visible')
    cy.getByTestId('load-token-btn').should('exist');
  });

  it('rosa token page', () => {
    TokenPages.navigateToROSAToken();
    cy.get('.pf-c-spinner').should('not.exist');
    cy.get('h1').scrollIntoView().contains('OpenShift Cluster Manager API Token').should('be.visible')
    cy.getByTestId('load-token-btn').should('exist');
  });
});
