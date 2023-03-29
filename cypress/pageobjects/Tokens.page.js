import Page from './page';
import GlobalNav from './GlobalNav.page';

class TokenPages extends Page {
  navigateToOCMToken() {
    GlobalNav.navigateTo('Downloads');
    cy.getByTestId('view-api-token-btn').scrollIntoView().click();
  }

  isOCMTokenPage() {
    super.assertUrlIncludes('/openshift/token');
  }

  navigateToROSAToken() {
    cy.visit('/token/rosa');
  }

  waitTokenPageIsLoaded() {
    // If the app is still loading, there are several stages — blank page, then spinner, then OCM renders.
    // So the "no spinner" check is not very reliable; the "h1" check is the real deal.
    cy.get('.pf-c-spinner', { timeout: 30000 }).should('not.exist');
    cy.get('h1', { timeout: 30000 }).scrollIntoView().contains('OpenShift Cluster Manager API Token').should('be.visible');
  }

  // check load token part
  checkLoadToken = (buttonLabel) => {
    cy.contains('Connect with offline tokens');
    cy.getByTestId('load-token-btn').click();
    cy.getByTestId(`${buttonLabel}`).should('have.attr','href');
    cy.get('input[aria-label="Copyable token"]').should('exist');
  }

  // check revoke previous tokens part
  checkRevokePrevousToken() {
    cy.contains('Revoke previous tokens');
    cy.contains('SSO application management').should('have.attr','href');
  }

  isROSATokenPage() {
    super.assertUrlIncludes('/token/rosa');
  }
}

export default new TokenPages();
