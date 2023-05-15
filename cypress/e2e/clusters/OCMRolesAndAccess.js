import { v4 } from 'uuid';
import { getAuthConfig } from '../../pageobjects/authConfig';
import Login from '../../pageobjects/login.page';
import ClusterListPage from '../../pageobjects/ClusterList.page';
import ClusterDetailsPage from '../../pageobjects/ClusterDetails.page';
import RegisterClusterPage from '../../pageobjects/RegisterCluster.page';
import OCMRolesAndAccessPage from '../../pageobjects/OCMRolesAndAccess.page';

describe('OCM Roles And Access', async () => {
  const clusterID = v4();
  const displayName = `cypress-${clusterID}`;
  const { username } = getAuthConfig();

  before(() => {
    cy.visit('/');
    Login.isLoginPageUrl();
    Login.login();

    ClusterListPage.isClusterListUrl();
    ClusterListPage.waitForDataReady();
    cy.getByTestId('create_cluster_btn').should('be.visible');
  });

  it('successfully creates a new cluster and redirects to its details page', () => {
    ClusterListPage.registerCluster().should('be.visible').click();
    ClusterListPage.isRegisterClusterUrl();
    ClusterListPage.isRegisterClusterScreen();
    RegisterClusterPage.clusterIDInput().type(clusterID).blur();
    RegisterClusterPage.displayNameInput().type(displayName).blur();
    RegisterClusterPage.submitButton().click();
    ClusterDetailsPage.isClusterDetailsPage(displayName);
  });

  it('successfully navigates to OCM Roles And Access', () => {
    OCMRolesAndAccessPage.accessControlTabButton().click();
    OCMRolesAndAccessPage.grantRoleButton().should('exist');
    OCMRolesAndAccessPage.OCMRolesAndAccessTable().should('exist');
  });

  it('successfully validate and grant the RBAC', () => {
    OCMRolesAndAccessPage.grantRoleButton().click();
    OCMRolesAndAccessPage.grantRoleUserInput().should('exist');
    OCMRolesAndAccessPage.grantRoleUserInput().type(' ');
    OCMRolesAndAccessPage.userInputError().should('have.text', 'Red Hat login cannot be empty.');
    OCMRolesAndAccessPage.grantRoleUserInput().type(v4());
    OCMRolesAndAccessPage.submitButton().click();
    OCMRolesAndAccessPage.userInputError().should(
      'have.text',
      'The specified username does not exist.',
    );
    OCMRolesAndAccessPage.grantRoleUserInput().clear();
    OCMRolesAndAccessPage.grantRoleUserInput().type(username).blur();
    OCMRolesAndAccessPage.submitButton().click();
    OCMRolesAndAccessPage.waitForGrantRoleModalToClear();
  });

  it('successfully displays the newly added user', () => {
    OCMRolesAndAccessPage.usernameCell().should('have.text', username);
    OCMRolesAndAccessPage.OCMRolesAndAccessTableActionButton().should('exist');
  });

  it('successfully deletes the user', () => {
    OCMRolesAndAccessPage.OCMRolesAndAccessTableActionButton().click();
    OCMRolesAndAccessPage.OCMRolesAndAccessTableDeleteButton().click();
    OCMRolesAndAccessPage.usernameCell().should('not.exist');
  });

  it('Finally, archive the cluster created', () => {
    ClusterDetailsPage.actionsDropdownToggle().click();
    ClusterDetailsPage.archiveClusterDropdownItem().click();
    ClusterDetailsPage.archiveClusterDialogConfirm().click();
    ClusterDetailsPage.waitForClusterDetailsLoad();
    ClusterDetailsPage.unarchiveClusterButton().should('exist');
  });
});
