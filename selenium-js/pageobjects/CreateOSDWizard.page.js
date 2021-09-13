import Page from './page';

class CreateOSDCluster extends Page {
  async isCreateOSDPage() {
    const URL = await browser.getUrl();
    return (URL === 'https://qa.foo.redhat.com:1337/openshift/create/osd'
    || URL === 'https://prod.foo.redhat.com:1337/openshift/create/osd');
  }

  async isCreateOSDTrialPage() {
    const URL = await browser.getUrl();
    return (URL === 'https://qa.foo.redhat.com:1337/openshift/create/osdtrial?trial=osd'
         || URL === 'https://prod.foo.redhat.com:1337/openshift/create/osdtrial?trial=osd');
  }

  async isBillingModelScreen() {
    return !!await $("//h2[contains(text(),'Welcome to Red Hat OpenShift Dedicated')]");
  }

  async isCloudProviderSelectionScreen() {
    return !!await $("//h3[contains(text(),'Select a cloud provider')]");
  }

  async isClusterDetailsScreen() {
    return !!await $("//h3[contains(text(),'Cluster details')]");
  }

  async isMachinePoolScreen() {
    return !!await $("//h2[contains(text(),'Default machine pool')]");
  }

  async isNetworkingScreen() {
    return !!await $("//h3[contains(text(),'Networking')]");
  }

  async isUpdatesScreen() {
    return !!await $("//h3[contains(text(),'Cluster updates')]");
  }

  async isReviewScreen() {
    return !!await $("//h3[contains(text(),'Review your dedicated cluster')]");
  }

  get awsProvider() { return $('div[data-test-id="aws-provider-card"]'); }

  get CCSSelected() { return $("input:checked[name='byoc'][value='true']"); }

  get TrialSelected() { return $("input:checked[name='billing_model'][value='standard_trial']"); }

  get fakeClusterBanner() { return $("//div[contains(text(), 'On submit, a fake OSD cluster will be created')]"); }

  get clusterNameInput() { return $('input#name'); }

  get clusterNameInputError() { return $('input#name ~ div.pf-m-error'); }

  get primaryButton() { return $('button.pf-c-button.pf-m-primary'); }
}

export default new CreateOSDCluster();
