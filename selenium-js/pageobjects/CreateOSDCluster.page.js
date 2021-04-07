import Page from './page';

class CreateOSDCluster extends Page {
  async isCreateOSDPage() {
    const URL = await browser.getUrl();
    return (URL === 'https://qa.foo.redhat.com:1337/openshift/create/osd'
    || URL === 'https://prod.foo.redhat.com:1337/openshift/create/osd');
  }

  get createAWSClusterCard() { return $("//a[contains(@href, '/openshift/create/osd/aws')]"); }
}

export default new CreateOSDCluster();
