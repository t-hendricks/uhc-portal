import LoginPage from '../pageobjects/login.page';
import ClusterListPage from '../pageobjects/ClusterList.page';
import CreateClusterPage from '../pageobjects/CreateCluster.page';
import CreateOSDCluster from '../pageobjects/CreateOSDCluster.page';
import CreateOSDAWSPage from '../pageobjects/CreateOSDAWS.page';
import CreateOSDFormPage from '../pageobjects/CreateOSDForm.page';
import ClusterDetailsPage from '../pageobjects/ClusterDetails.page';

describe('OSD cluster tests', async () => {
  // eslint-disable-next-line no-undef
  before('should login successfully', async () => {
    await LoginPage.open();
    await LoginPage.login();

    await browser.waitUntil(ClusterListPage.isClusterListPage);
    await browser.waitUntil(ClusterListPage.isReady);
    expect(await ClusterListPage.createClusterBtn).toExist();
  });

  const clusterName = `test-${Math.random().toString(36).substr(2, 10)}`;

  describe('Create OSD cluster on AWS flow', async () => {
    it('navigates to create OSD cluster', async () => {
      await (await ClusterListPage.createClusterBtn).click();
      expect(await CreateClusterPage.isCreateClusterPage()).toBeTruthy();
      await (await CreateClusterPage.createOSDClusterBtn).click();
      expect(await CreateOSDCluster.isCreateOSDPage()).toBeTruthy();
    });

    it('navigates to create OSD on AWS form', async () => {
      await (await CreateOSDCluster.createAWSClusterCard).click();
      expect(await CreateOSDAWSPage.isCreateOSDAWSPage()).toBeTruthy();
      expect(await CreateOSDFormPage.fakeClusterBanner).toExist();
    });

    it('disallows submitting an empty form and scrolls to error', async () => {
      await (await CreateOSDFormPage.submitButton).click();
      expect((await CreateOSDFormPage.clusterNameInputError).scrollIntoView());
      expect(CreateOSDFormPage.clusterNameInputError).toHaveText('Cluster name is required.');
    });

    it('shows an error with invalid and empty names', async () => {
      await (await CreateOSDFormPage.clusterNameInput).setValue('a'.repeat(16));
      expect(CreateOSDFormPage.clusterNameInputError).toExist();
      expect(CreateOSDFormPage.clusterNameInputError).toHaveText('Cluster names may not exceed 15 characters.');

      await (await CreateOSDFormPage.clusterNameInput).setValue('');
      expect(CreateOSDFormPage.clusterNameInputError).toExist();
      expect(CreateOSDFormPage.clusterNameInputError).toHaveText('Cluster name is required.');
    });

    it('creates an OSD cluster and navigates to its details page', async () => {
      await (await CreateOSDFormPage.clusterNameInput).setValue(clusterName);
      expect(CreateOSDFormPage.clusterNameInputError).not.toExist();
      await (await CreateOSDFormPage.submitButton).click();
      await browser.waitUntil(
        async () => ClusterDetailsPage.isClusterDetailsPage(),
        { timeout: 60000 }, // 1 minute
      );
      expect(ClusterDetailsPage.clusterNameTitle).toHaveText(clusterName);
    });
  });

  describe.skip('Access control tab', async () => {
    it('waits until cluster installs and goes to the access control tab', async () => {
      await browser.waitUntil(
        async () => ((await ClusterDetailsPage.installationSuccessAlert).isDisplayed()),
        { timeout: 300000 },
      );
      await (await ClusterDetailsPage.accessControlTabBtn).click();
      await (await ClusterDetailsPage.addIDPButton).click();
      expect(ClusterDetailsPage.IDPModalBody).toBeDisplayed();
      await (await ClusterDetailsPage.IDPSelection).click();
      await (await (await ClusterDetailsPage.IDPSelection).selectByVisibleText('Google'));
      expect(ClusterDetailsPage.IDPNameInput).toHaveValue('Google');
      const requiredFields = await (ClusterDetailsPage.IDPModalRequiredFields());
      requiredFields.foreach((input) => {
        if (!input.getValue()) {
          input.setValue('asdf');
        }
      });
      await (await ClusterDetailsPage.addIDPModalConfirm).click();
    });
  });

  after('Finally, delete the cluster created', async () => {
    await browser.waitUntil(
      async () => ((await ClusterDetailsPage.actionsDropdownToggle).isClickable()),
    );
    await (await ClusterDetailsPage.actionsDropdownToggle).click();
    await (await ClusterDetailsPage.deleteClusterDropdownItem).click();
    await (await ClusterDetailsPage.deleteClusterDialogInput).setValue(clusterName);
    await (await ClusterDetailsPage.deleteClusterDialogConfirm).click();
  }).timeout(300000);
});
