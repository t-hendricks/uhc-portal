import get from 'lodash/get';
import Page from './page';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class ClusterList extends Page {
  isClusterListUrl() {
    super.assertUrlIncludes('/openshift/');
  }

  filterTxtField = () => cy.get('input[placeholder="Filter by name or ID..."]');
  viewOnlyMyCluster = () => cy.get('label > input[id="view-only-my-clusters"]');
  viewOnlyMyClusterHelp = () => cy.get('label[for="view-only-my-clusters"]').find('button').first();
  tooltipviewOnlyMyCluster = () => cy.get('div.pf-c-popover__body');
  viewClusterArchives = () => cy.get('ul.pf-c-dropdown__menu').find('a').contains("View cluster archives");
  assistedInstallerClusters = () => cy.get('ul.pf-c-dropdown__menu').find('a').contains("Assisted Installer clusters");
  registerCluster = () => cy.getByTestId('register-cluster-item')

  isRegisterClusterUrl() {
    super.assertUrlIncludes('/openshift/register');
  }

  isClusterListScreen() {
    cy.contains('h1', 'Clusters');
  }

  isRegisterClusterScreen() {
    cy.contains('h1', 'Register disconnected cluster');
  }

  isClusterArchivesScreen() {
    cy.contains('h1', 'Cluster Archives');
  }

  isClusterArchivesUrl() {
    super.assertUrlIncludes('/openshift/archived');
  }

  clusterListRefresh() {
    cy.get('button[aria-label="Refresh"]').click();
  }

  clickClusterTypeFilters() {
    cy.get('button > span').contains(" Cluster type").click({ force: true });
  }

  clickClusterTypes(type) {
    cy.get('div > label', { timeout: 10000 }).contains(type).click({ force: true });
  }

  clickClusterListExtraActions() {
    cy.getByTestId('cluster-list-extra-actions-dropdown').should('be.visible').click();
  }

  checkClusterListTableHeaders(headers) {
    headers.forEach(header => cy.get('table[aria-label="Cluster List"]').contains('th', header).should('be.visible'));
  }

  searchForClusterWithStatus(status) {
    cy.contains('td[data-label="Status"]', status).siblings().get('td[class="pf-c-table__action"] > div').first().click();
  }

  waitForDataReady() {
    cy.get('div[data-ready="true"]', { timeout: 30000 }).should('exist');
  }
}

export default new ClusterList();
