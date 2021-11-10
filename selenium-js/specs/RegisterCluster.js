import { v4 } from 'uuid';
import LoginPage from '../pageobjects/login.page';
import ClusterListPage from '../pageobjects/ClusterList.page';
import ClusterDetailsPage from '../pageobjects/ClusterDetails.page';
import RegisterClusterPage from '../pageobjects/RegisterCluster.page';

describe('Register cluster flow', async () => {
  let clusterName;
  it('should login successfully', async () => {
    await LoginPage.open();
    await LoginPage.login();

    await browser.waitUntil(ClusterListPage.isClusterListPage);
    await browser.waitUntil(ClusterListPage.isReady);
    expect(await ClusterListPage.createClusterBtn).toExist();
  });

  it('navigate to register cluster (wide window)', async () => {
    await ClusterListPage.navigateToRegisterCluster({ wide: true });
    await browser.waitUntil(RegisterClusterPage.isRegisterClusterPage);
  });

  it('shows an error when cluster ID is not valid', async () => {
    await (await RegisterClusterPage.clusterIDInput).setValue('not really a uuid');
    expect(RegisterClusterPage.clusterIDError).toExist();
    expect(RegisterClusterPage.clusterIDError).toHaveText("Cluster ID 'not really a uuid' is not a valid UUID.");

    await (await RegisterClusterPage.clusterIDInput).setValue('');
    expect(RegisterClusterPage.clusterIDError).toExist();
    expect(RegisterClusterPage.clusterIDError).toHaveText('Cluster ID is required.');
  });

  it('shows error when URL is not valid', async () => {
    await (await RegisterClusterPage.clusterURLInput).setValue('asdf');
    expect(RegisterClusterPage.clusterURLError).toExist();
    expect(RegisterClusterPage.clusterIDError).toHaveText('The URL should include the scheme prefix (http://, https://).');

    await (await RegisterClusterPage.clusterURLInput).setValue('https://uwu');
    expect(RegisterClusterPage.clusterURLError).toExist();
    expect(RegisterClusterPage.clusterIDError).toHaveText('Invalid URL');
  });

  it('shows error when display name is not valid', async () => {
    await (await RegisterClusterPage.clusterURLInput).setValue('a'.repeat(70));
    expect(RegisterClusterPage.displayNameError).toExist();
    expect(RegisterClusterPage.displayNameError).toHaveText('Cluster display name may not exceed 63 characters.');
  });

  it('redirects to cluster list when clicking cancel', async () => {
    await (await RegisterClusterPage.cancelButton).click();
    expect(await ClusterListPage.isClusterListPage()).toBeTruthy();
  });

  it('creates a new cluster and redirects to its details page', async () => {
    await ClusterListPage.navigateToRegisterCluster({ wide: true });
    await browser.waitUntil(RegisterClusterPage.isRegisterClusterPage);

    const clusterID = v4();
    clusterName = `selenium-${clusterID}`;
    await (await RegisterClusterPage.clusterIDInput).setValue(clusterID);
    expect(RegisterClusterPage.clusterIDError).not.toExist();
    await (await RegisterClusterPage.displayNameInput).setValue(clusterName);
    expect(RegisterClusterPage.displayNameError).not.toExist();
    await (await RegisterClusterPage.submitButton).click();
    expect(ClusterDetailsPage.isClusterDetailsPage(clusterID)).toBeTruthy();
  });

  it('successfully changes the console URL for the cluster', async () => {
    await (await ClusterDetailsPage.addConsoleURLButton).click();
    await (await ClusterDetailsPage.editConsoleURLDialogInput).setValue('http://example.com');
    await (await ClusterDetailsPage.editConsoleURLDialogConfirm).click();
    expect(ClusterDetailsPage.editConsoleURLDialogConfirm).not.toExist();
    expect(ClusterDetailsPage.openConsoleButton).toHaveAttribute('href', 'http://example.com');
  });

  it('successfully changes display name', async () => {
    await (await ClusterDetailsPage.actionsDropdownToggle).waitForClickable();
    await (await ClusterDetailsPage.actionsDropdownToggle).click();
    await (await ClusterDetailsPage.editDisplayNameDropdownItem).click();
    expect(ClusterDetailsPage.editDisplayNameInput).toExist();
    await (await ClusterDetailsPage.editDisplayNameInput).setValue(`${clusterName}-test`);
    await (await ClusterDetailsPage.editDisplaynameConfirm).click();
    expect(ClusterDetailsPage.editDisplaynameConfirm).not.toExist();
    expect(ClusterDetailsPage.clusterNameTitle).toHaveText(`${clusterName}-test`);
  });

  it('successfully archives the newly created cluster', async () => {
    await (await ClusterDetailsPage.actionsDropdownToggle).click();
    await (await ClusterDetailsPage.archiveClusterDropdownItem).click();
    await (await ClusterDetailsPage.archiveClusterDialogConfirm).click();
    expect(ClusterDetailsPage.archiveClusterDialogConfirm).not.toExist();
    expect(ClusterDetailsPage.successNotification).toExist();
    expect(ClusterDetailsPage.unarchiveClusterButton).toExist();
  });

  it('successfully unarchives the archived cluster', async () => {
    await (await ClusterDetailsPage.unarchiveClusterButton).click();
    await (await ClusterDetailsPage.unarchiveClusterDialogConfirm).click();
    expect(ClusterDetailsPage.unarchiveClusterDialogConfirm).not.toExist();
    expect(ClusterDetailsPage.successNotification).toExist();
    expect(ClusterDetailsPage.actionsDropdownToggle).toExist();
  });

  // Here we have a table of clusters, so there should be a kebab menu
  it('navigate to register cluster (narrow window)', async () => {
    const currentURL = await browser.getUrl();
    // Return to "Clusters" list
    await browser.url('/openshift');
    const {
      width,
      height,
    } = await browser.getWindowSize();
    // Resize browser to 800x
    await browser.setWindowSize(800, height);

    await ClusterListPage.navigateToRegisterCluster({ wide: false });
    await browser.waitUntil(RegisterClusterPage.isRegisterClusterPage);

    // Restore window size
    await browser.setWindowSize(width, height);
    // Go back to the screen we came from
    await browser.url(currentURL);
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
