import get from 'lodash/get';
import Page from './page';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class ClusterList extends Page {
  isClusterListUrl() {
    super.assertUrlIncludes('/openshift/');
  }

  filterTxtField = () => cy.get('input[placeholder="Filter by name or ID..."]', { timeout: 10000 });
  viewOnlyMyCluster = () => cy.get('label > input[id="view-only-my-clusters"]');
  viewOnlyMyClusterHelp = () => cy.get('label[for="view-only-my-clusters"]').find('button').first();
  tooltipviewOnlyMyCluster = () => cy.get('div.pf-c-popover__body');
  viewClusterArchives = () => cy.get('div.pf-c-toolbar__item').find('a').contains("View cluster archives");
  assistedInstallerClusters = () => cy.get('ul.pf-c-dropdown__menu').find('a').contains("Assisted Installer clusters");
  registerCluster = () => cy.getByTestId('register-cluster-item')
  showActiveClusters = () => cy.get('a').contains('Show active clusters');
  itemPerPage = () => cy.get('button[aria-label="Items per page"]').last();
  goToLastPageBtn = () => cy.get('button[aria-label="Go to last page"]').last();
  goToFirstPageBtn = () => cy.get('button[aria-label="Go to first page"]').last();
  typeColumnsInClusterList = () => cy.get('td[data-label="Type"] > span')
  filterdClusterTypesValues = () => cy.get('span.pf-c-chip__text')

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

  // Checks if the selected filters are populated filter rule string in cluster/archives list.
  checkFilteredClusterTypes(type, isContains) {
    var criteria = 'eq'
    if (!isContains) {
      criteria = 'not.eq'
    }
    this.filterdClusterTypesValues().each(($elements) => {
      cy.wrap($elements).invoke('text').should(criteria, type)
    })
  }

  // Checks if the selected cluster type filters matches with the list of clusters filtered in list.
  checkFilteredClustersFromClusterList(type, isContains) {
    var criteria = 'eq'
    if (!isContains) {
      criteria = 'not.eq'
    }
    this.typeColumnsInClusterList().each(($elements) => {
      cy.wrap($elements).invoke('text').should(criteria, type)
    })
  }

  goToLastPage() {
    this.goToLastPageBtn().then(($btn) => {
      if ($btn.is(":enabled")) {
        cy.wrap($btn).click()
      }
    })
  }

  goToFirstPage() {
    this.goToFirstPageBtn().then(($btn) => {
      if ($btn.is(":enabled")) {
        cy.wrap($btn).click()
      }
    })
  }

  clickClusterListExtraActions() {
    cy.getByTestId('cluster-list-extra-actions-dropdown').should('be.visible').click();
  }
  clickClusterListTableHeader(header) {
    cy.get('th[data-label="' + header + '"]', { timeout: 20000 }).should('be.visible').click();
  }

  scrollClusterListPageTo(direction) {
    cy.get('main.pf-c-page__main').find('div.pf-c-drawer__content').scrollTo(direction);
  }

  clickPerPageItem(count) {
    cy.get('button[data-action="per-page-' + count + '"]').scrollIntoView().click();
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

  waitForArchiveDataReady() {
    cy.get('div.cluster-list', { timeout: 30000 }).should('exist');
    cy.get('div.ins-c-spinner.cluster-list-spinner', { timeout: 30000 }).should('not.exist');

  }

  clearFilters() {
    cy.get('button', { timeout: 30000 }).contains("Clear filters").click({ force: true });
  }


}

export default new ClusterList();
