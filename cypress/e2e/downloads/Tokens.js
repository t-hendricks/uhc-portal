import Login from '../../pageobjects/login.page';
import TokenPages from '../../pageobjects/Tokens.page';
import ClusterListPage from '../../pageobjects/ClusterList.page';

describe('Token pages', { tags: ['ci', 'smoke'] }, () => {
  beforeEach(() => {
    cy.visit('/');
    Login.isLoginPageUrl();
    Login.login();

    ClusterListPage.isClusterListUrl();
    ClusterListPage.waitForDataReady();
  });

  it('ocm-cli token page', () => {
    TokenPages.navigateToOCMToken();
    TokenPages.waitTokenPageIsLoaded();
    TokenPages.isOCMTokenPage();
    cy.getByTestId('load-token-btn').should('exist');
  });

  it('rosa token page', () => {
    TokenPages.navigateToROSAToken();
    TokenPages.waitTokenPageIsLoaded();
    TokenPages.isROSATokenPage();
    cy.getByTestId('load-token-btn').should('exist');
  });

  it('ocm and rosa revoke token page (OCP-23060)', () => {
    //TODO: Check on loading new token creation, currentlyit creates issues with offline tokens
    cy.visit('/token');
    TokenPages.waitTokenPageIsLoaded();
    TokenPages.checkRevokePrevousToken();
    TokenPages.navigateToROSAToken();
    TokenPages.waitTokenPageIsLoaded();
    TokenPages.checkRevokePrevousToken();
  });

});
