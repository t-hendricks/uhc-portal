import LoginPage from '../pageobjects/login.page';
import ClusterListPage from '../pageobjects/ClusterList.page';
import RegisterClusterPage from '../pageobjects/RegisterCluster.page';


describe('Register cluster flow', async () => {
  it('should login successfully', async () => {
    await LoginPage.open();
    await LoginPage.login();

    await browser.waitUntil(ClusterListPage.isClusterListPage);
    await browser.waitUntil(ClusterListPage.isReady);
    expect(await ClusterListPage.createClusterBtn).toExist();
  });

  it('navigate to register cluster', async () => {
    await ClusterListPage.navigateToRegisterCluster();
    expect(await RegisterClusterPage.isRegisterClusterPage()).toBeTruthy();
  });

  it('shows an error when cluster ID is not valid', async () => {
    await (await RegisterClusterPage.clusterIDInput).setValue('not really a uuid');
    expect(RegisterClusterPage.clusterIDError).toExist();
    expect(RegisterClusterPage.clusterIDError).toHaveText("Cluster ID 'not really a uuid' is not a valid UUID.");

    await (await RegisterClusterPage.clusterIDInput).setValue('');
    expect(RegisterClusterPage.clusterIDError).toExist();
    expect(RegisterClusterPage.clusterIDError).toHaveText('Cluster ID is required.');
  });

  // TODO finish register cluster tests
});
