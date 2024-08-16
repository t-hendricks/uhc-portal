import Page from './page';

class Subscription extends Page {
  planTypeHelpButton = () => cy.get('th').contains('Plan type').find('button');

  enableMarketplaceLink = () => cy.get('a').contains('Enable in Marketplace');

  learnMoreLink = () => cy.get('a').contains('Learn more');

  dedicatedOnDemandLink = () => cy.get('a').contains('Dedicated (On-Demand Limits)');

  isDedicatedAnnualPage() {
    cy.contains('h1', 'Dedicated (Annual)', { timeout: 50000 });
  }

  isDedicatedSectionHeader() {
    cy.contains('div', 'OpenShift Dedicated');
  }

  isSubscriptionTableHeader() {
    cy.contains('div', 'Quota');
  }

  isDedicatedOnDemandPage() {
    cy.contains('h1', 'Dedicated (On-Demand Limits)');
  }

  checkQuotaTableColumns(columnName) {
    cy.get('th').contains(columnName).should('be.visible');
  }

  getQuotaTableRow(items) {
    return cy
      .get('td')
      .contains(new RegExp('^' + items.related_resources[0].resource_type + '$', 'g'));
  }
}
export default new Subscription();
