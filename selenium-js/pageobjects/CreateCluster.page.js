import Page from './page';

class CreateCluster extends Page {
  async isCreateClusterPage() {
    const URL = await browser.getUrl();
    return (
      URL.startsWith('https://qa.foo.redhat.com:1337/openshift/create') ||
      URL.startsWith('https://prod.foo.redhat.com:1337/openshift/create')
    );
  }

  get createOSDClusterBtn() {
    return $("//a[contains(text(),'Create cluster')]");
  }

  get createOSDTrialClusterBtn() {
    return $("//a[contains(text(),'Create trial cluster')]");
  }
}

export default new CreateCluster();
