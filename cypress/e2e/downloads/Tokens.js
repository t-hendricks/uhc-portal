import TokenPages from '../../pageobjects/Tokens.page';

describe('Token pages', { tags: ['ci', 'smoke'] }, () => {
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
    cy.visit('/token', { retryOnNetworkFailure: true });
    TokenPages.waitTokenPageIsLoaded();
    TokenPages.checkRevokePrevousToken();
    TokenPages.navigateToROSAToken();
    TokenPages.waitTokenPageIsLoaded();
    TokenPages.checkRevokePrevousToken();
  });
});
