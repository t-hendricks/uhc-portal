import { v4 } from 'uuid';
import { getAuthConfig } from '../authConfig';
import LoginPage from '../pageobjects/login.page';
import ClusterListPage from '../pageobjects/ClusterList.page';
import ClusterDetailsPage from '../pageobjects/ClusterDetails.page';
import RegisterClusterPage from '../pageobjects/RegisterCluster.page';
import OCMRolesAndAccessPage from '../pageobjects/OCMRolesAndAccess.page';

describe('OCM Roles And Access', async () => {
  let clusterName;
  const { username } = getAuthConfig();

  it('should successfully logs in', async () => {
    await LoginPage.open();
    await LoginPage.login();

    await browser.waitUntil(ClusterListPage.isClusterListPage);
    await browser.waitUntil(ClusterListPage.isReady);
    expect(await ClusterListPage.createClusterBtn).toExist();
  });

  it('successfully creates a new cluster and redirects to its details page', async () => {
    await ClusterListPage.navigateToRegisterCluster({ wide: true });
    expect(await RegisterClusterPage.isRegisterClusterPage()).toBeTruthy();

    const clusterID = v4();
    clusterName = `selenium-${clusterID}`;
    await (await RegisterClusterPage.clusterIDInput).setValue(clusterID);
    await (await RegisterClusterPage.displayNameInput).setValue(clusterName);
    await (await RegisterClusterPage.submitButton).click();
    expect(ClusterDetailsPage.isClusterDetailsPage(clusterID)).toBeTruthy();
  });

  it('successfully navigates to OCM Roles And Access', async () => {
    await (await OCMRolesAndAccessPage.accessControlTabButton).click();
    expect(OCMRolesAndAccessPage.grantRoleButton).toExist();
    expect(OCMRolesAndAccessPage.OCMRolesAndAccessTable).toExist();
  });

  it('successfully validate and grant the RBAC', async () => {
    await (await OCMRolesAndAccessPage.grantRoleButton).click();
    expect(OCMRolesAndAccessPage.grantRoleUserInput).toExist();
    // cannot be empty username
    await (await OCMRolesAndAccessPage.grantRoleUserInput).setValue(' ');
    expect(OCMRolesAndAccessPage.cannotBeEmptyError).toExist();
    // cannot be non-existing user
    await (await OCMRolesAndAccessPage.grantRoleUserInput).setValue(v4());
    await (await OCMRolesAndAccessPage.submitButton).click();
    expect(OCMRolesAndAccessPage.cannotBeFoundError).toExist();
    // succeed
    await (await OCMRolesAndAccessPage.grantRoleUserInput).setValue(username);
    await (await OCMRolesAndAccessPage.submitButton).click();
    expect(OCMRolesAndAccessPage.submitButton).not.toExist();
  });

  it('successfully displays the newly added user', async () => {
    expect(await OCMRolesAndAccessPage.usernameCell(username)).toExist();
    expect(OCMRolesAndAccessPage.OCMRolesAndAccessTableActionButton).toExist();
  });

  it('successfully deletes the user', async () => {
    await (await OCMRolesAndAccessPage.OCMRolesAndAccessTableActionButton).click();
    await (await OCMRolesAndAccessPage.OCMRolesAndAccessTableDeleteButton).click();
    expect(await OCMRolesAndAccessPage.usernameCell(username)).not.toExist();
  });

  after('Finally, archive the cluster created', async () => {
    await browser.waitUntil(
      async () => ((await ClusterDetailsPage.actionsDropdownToggle).isClickable()),
    );
    await (await ClusterDetailsPage.actionsDropdownToggle).click();
    await (await ClusterDetailsPage.archiveClusterDropdownItem).click();
    await (await ClusterDetailsPage.archiveClusterDialogConfirm).click();
  });
});
