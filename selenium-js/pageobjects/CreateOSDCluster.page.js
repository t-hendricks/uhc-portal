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

  get CCSSelected() { return $("//button[@id='customer cloud subscription' and contains(@class, 'selected')]"); }

  get createAWSClusterCard() { return $("//a[contains(@href, '/openshift/create/osd/aws')]"); }

  get createAWSOSDTrialClusterCard() { return $("//a[contains(@href, '/openshift/create/osdtrial/aws')]"); }
}

export default new CreateOSDCluster();
