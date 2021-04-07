import Page from './page';

class CreateCluster extends Page {
  async isCreateClusterPage() {
    const URL = await browser.getUrl();
    return URL.startsWith('https://qa.foo.redhat.com:1337/openshift/create')
    || URL.startsWith('https://prod.foo.redhat.com:1337/openshift/create');
  }

  get createOSDClusterBtn() { return $("//button[contains(text(),'Create cluster')]"); }
}

export default new CreateCluster();
