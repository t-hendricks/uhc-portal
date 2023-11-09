import Login from '../../pageobjects/login.page';
import ClusterListPage from '../../pageobjects/ClusterList.page';
import ClusterDetails from '../../pageobjects/ClusterDetails.page';

const clusterPropertiesFile = require('../../fixtures/rosa/RosaClusterDefaultPublicSingleZoneProperties.json');

describe(
  'ROSA Cluster - Delete Public single zone cluster',
  { tags: ['day3', 'rosa', 'delete', 'default', 'singlezone'] },
  () => {
    before(() => {
      cy.visit('/');
      Login.isLoginPageUrl();
      Login.login();

      ClusterListPage.isClusterListUrl();
      ClusterListPage.waitForDataReady();
      cy.getByTestId('create_cluster_btn').should('be.visible');
      ClusterListPage.isClusterListScreen();
      ClusterListPage.filterTxtField().should('be.visible').click();
      ClusterListPage.filterTxtField().clear().type(clusterPropertiesFile.ClusterName);
      ClusterListPage.waitForDataReady();
      ClusterListPage.openClusterDefinition(clusterPropertiesFile.ClusterName);
    });

    it('Deleter Cluster from Overview tab', () => {
      cy.get('h1.cl-details-page-title', { timeout: 20000 }).should(
        'have.text',
        clusterPropertiesFile.ClusterName,
      );
      ClusterDetails.isClusterDetailsPage(clusterPropertiesFile.ClusterName);
      ClusterDetails.actionsDropdownToggle().click();
      ClusterDetails.deleteClusterDropdownItem().click();
      ClusterDetails.deleteClusterNameInput().clear().type(clusterPropertiesFile.ClusterName);
      ClusterDetails.deleteClusterConfirm().click();
      ClusterDetails.waitForDeleteClusterActionComplete();
    });
  },
);
