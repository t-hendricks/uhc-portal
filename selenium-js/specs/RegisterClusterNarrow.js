import LoginPage from '../pageobjects/login.page';
import ClusterListPage from '../pageobjects/ClusterList.page';
import RegisterClusterPage from '../pageobjects/RegisterCluster.page';

describe('Register cluster flow', async () => {
  it('should login successfully', async () => {
    await LoginPage.open();
    await LoginPage.login();

    await browser.waitUntil(ClusterListPage.isClusterListPage);
    await browser.waitUntil(ClusterListPage.isReady);
    expect(await ClusterListPage.createClusterBtn)
      .toExist();
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
    expect(await RegisterClusterPage.isRegisterClusterPage())
      .toBeTruthy();

    // Restore window size
    await browser.setWindowSize(width, height);
    // Go back to the screen we came from
    await browser.url(currentURL);
  });
});
