import Login from '../../pageobjects/login.page';
import TokenPages from '../../pageobjects/Tokens.page';
import ClusterListPage from '../../pageobjects/ClusterList.page';

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

  it('Can get offline token from tokens page (OCP-23060)', {tags: ['smoke']}, () => {
    cy.visit('/token');
    TokenPages.waitTokenPageIsLoaded();
    TokenPages.checkLoadToken('download-btn-ocm');
    TokenPages.checkRevokePrevousToken();
    TokenPages.navigateToROSAToken();
    TokenPages.waitTokenPageIsLoaded();
    TokenPages.checkLoadToken('download-btn-rosa');
    TokenPages.checkRevokePrevousToken();
  });

});
