import Page from './page';
import GlobalNav from './GlobalNav.page';

class TokenPages extends Page {
  navigateToOCMToken() {
    GlobalNav.navigateTo('Downloads');
    cy.getByTestId('view-api-token-btn').scrollIntoView().click();
  }

  navigateToROSAToken() {
    cy.visit('/token/rosa');
  }

  tokenPageIsLoaded() {
    cy.get('.pf-c-spinner').should('not.exist');
    cy.get('h1').scrollIntoView().contains('OpenShift Cluster Manager API Token').should('be.visible');
  }

  //check load token part
  checkLoadToken = (buttonLabel) => {
    cy.contains('Connect with offline tokens');
    cy.getByTestId('load-token-btn').click();
    cy.getByTestId(`${buttonLabel}`).should('have.attr','href');
    cy.get('input[aria-label="Copyable token"]').should('exist');
  }

  //check revoke previous tokens part
  checkRevokePrevousToken() {
    cy.contains('Revoke previous tokens');
    cy.contains('SSO application management').should('have.attr','href');
  }

}

export default new TokenPages();
