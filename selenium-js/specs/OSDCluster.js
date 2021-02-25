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
        { timeout: 1 * 60 * 1000 },
      );
      expect(ClusterDetailsPage.clusterNameTitle).toHaveText(clusterName);
    });
  });

  describe('Access control tab', async () => {
    it('waits until cluster installs and goes to the access control tab', async () => {
      await ClusterDetailsPage.waitForInstallCompletion();
      await (await ClusterDetailsPage.accessControlTabBtn).click();
      expect(await ClusterDetailsPage.addIDPButton).toBeDisplayed();
    });

    it('adds a new IDP to the cluster', async () => {
      await (await ClusterDetailsPage.addIDPButton).click();
      expect(ClusterDetailsPage.IDPModalBody).toBeDisplayed();
      await (await ClusterDetailsPage.IDPSelection).click();
      await (await ClusterDetailsPage.IDPSelection).selectByVisibleText('Google');
      expect(ClusterDetailsPage.IDPNameInput).toHaveValue('Google');
      const requiredFields = await (await ClusterDetailsPage.IDPModalRequiredFields);
      await Promise.all(requiredFields.map(async (input) => {
        const v = await input.getValue();
        if (!v) {
          await input.setValue('asdf');
        }
      }));
      await (await ClusterDetailsPage.addIDPModalConfirm).click();
      expect(await ClusterDetailsPage.IDPTable).toBeDisplayed();
    });

    it.skip('copies IDP URL from the table', async () => {
      await (await ClusterDetailsPage.firstRowURLCopy).click();
      expect(await navigator.clipboard.readText()).toBe('https://oauth-openshift.com/veryfakewebconsole/oauth2callback/Google');
    });

    it('deletes the newly created IDP', async () => {
      await (await ClusterDetailsPage.firstRowActions).click();
      await (await ClusterDetailsPage.firstRowDeleteIDP).click();
      expect(await ClusterDetailsPage.deleteIDPModal).toBeDisplayed();
      await (await ClusterDetailsPage.deleteIDPModalRemoveBtn).click();
      expect(await ClusterDetailsPage.deleteIDPModal).not.toBeDisplayed();
      expect(await ClusterDetailsPage.IDPTable).not.toBeDisplayed();
    });
  });

  describe('Networking tab', async () => {
    it('navigates to the networking tab', async () => {
      await ClusterDetailsPage.navigateToNetworkingTab();
      expect(await ClusterDetailsPage.routersCard).toBeDisplayed();
      expect(await ClusterDetailsPage.saveNetworkingChangesBtn).toBeDisabled();
    });

    it.skip('copies the control plane API endpoint url', async () => {
      await (await ClusterDetailsPage.copyControlPlaneAPIURLBtn).click();
      expect(await navigator.clipboard.readText()).toBe('https://example.com/veryfakeapi');
    });

    it('sets public API to be private', async () => {
      expect(await ClusterDetailsPage.makeAPIPrivateCheckbox).not.toBeChecked();
      await (await ClusterDetailsPage.makeAPIPrivateCheckbox).click();
      expect(await ClusterDetailsPage.makeAPIPrivateCheckbox).toBeChecked();
      expect(await ClusterDetailsPage.saveNetworkingChangesBtn).toBeEnabled();
    });

    it('reverts the change, causing the form to be reset', async () => {
      await (await ClusterDetailsPage.makeAPIPrivateCheckbox).click();
      expect(await ClusterDetailsPage.makeAPIPrivateCheckbox).not.toBeChecked();
      expect(await ClusterDetailsPage.saveNetworkingChangesBtn).toBeDisabled();
    });

    it('sets public default router private', async () => {
      expect(await ClusterDetailsPage.additionalRouterURLCopybox).toHaveValueContaining(`https://apps.${clusterName}`);
      expect(await ClusterDetailsPage.makeDefaultRouterPrivateCheckbox).not.toBeChecked();
      await (await ClusterDetailsPage.makeDefaultRouterPrivateCheckbox).click();
      expect(await ClusterDetailsPage.makeDefaultRouterPrivateCheckbox).toBeChecked();
      expect(await ClusterDetailsPage.saveNetworkingChangesBtn).toBeEnabled();
    });

    it('Enables additional router', async () => {
      expect(await ClusterDetailsPage.enableAdditionalRouterSwitch).not.toBeChecked();
      expect(await ClusterDetailsPage.additionalRouterURLCopybox).not.toBeDisabled();
      await (await ClusterDetailsPage.enableAdditionalRouterSwitch).click();
      expect(await ClusterDetailsPage.enableAdditionalRouterSwitch).toBeChecked();
      expect(await ClusterDetailsPage.additionalRouterURLCopybox).toBeDisabled();
      expect(await ClusterDetailsPage.additionalRouterURLCopybox).toHaveValueContaining(`https://apps2.${clusterName}`);
    });

    it('disallows adding a label match that is not well formatted', async () => {
      await (await ClusterDetailsPage.labelMatchForAdditionalRouterField).setValue('label!');
      expect(await ClusterDetailsPage.labelMatchFieldError).toBeDisplayed();
      await (await ClusterDetailsPage.labelMatchForAdditionalRouterField).setValue('label=name!');
      expect(await ClusterDetailsPage.labelMatchFieldError).toBeDisplayed();
      await (await ClusterDetailsPage.labelMatchForAdditionalRouterField).setValue('label=name');
      expect(await ClusterDetailsPage.labelMatchFieldError).not.toBeDisplayed();
      await (await ClusterDetailsPage.labelMatchForAdditionalRouterField).setValue('label=name,');
      expect(await ClusterDetailsPage.labelMatchFieldError).toBeDisplayed();
      await (await ClusterDetailsPage.labelMatchForAdditionalRouterField).setValue('label=name,label2=name2');
      expect(await ClusterDetailsPage.labelMatchFieldError).not.toBeDisplayed();
    });

    it('saves new networking configuration', async () => {
      expect(await ClusterDetailsPage.saveNetworkingChangesBtn).toBeEnabled();
      await (await ClusterDetailsPage.saveNetworkingChangesBtn).click();
      expect(await ClusterDetailsPage.saveNetworkingChangesModal).toBeDisplayed();
      await (await ClusterDetailsPage.saveNetworkingChangesModalConfirmBtn).click();
      expect(await ClusterDetailsPage.saveNetworkingChangesModal).not.toBeDisabled();
      expect(await ClusterDetailsPage.saveNetworkingChangesBtn).toBeDisabled();
    });
  });

  after('Finally, delete the cluster created', async () => {
    await browser.waitUntil(
      async () => ((await ClusterDetailsPage.actionsDropdownToggle).isClickable()),
      { timeout: 1 * 60 * 1000 },
    );
    await (await ClusterDetailsPage.actionsDropdownToggle).click();
    await (await ClusterDetailsPage.deleteClusterDropdownItem).click();
    await (await ClusterDetailsPage.deleteClusterDialogInput).setValue(clusterName);
    await (await ClusterDetailsPage.deleteClusterDialogConfirm).click();
  }).timeout(8 * 60 * 1000);
});

describe('OSD Trial cluster tests', async () => {
  describe('View Create OSD Trial cluster page', async () => {
    it('navigates to create OSD Trial cluster and CCS is selected', async () => {
      await (await ClusterListPage.createClusterBtn).click();
      expect(await CreateClusterPage.isCreateClusterPage()).toBeTruthy();
      await (await CreateClusterPage.createOSDTrialClusterBtn).click();
      expect(await CreateOSDCluster.isCreateOSDTrialPage()).toBeTruthy();
      await (await CreateOSDCluster.createAWSOSDTrialClusterCard).click();
      expect(await CreateOSDCluster.CCSSelected).toExist();
    });
  });
});
