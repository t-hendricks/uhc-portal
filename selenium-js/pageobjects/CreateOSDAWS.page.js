import Page from './page';

class CreateOSDAWSPage extends Page {
  async isCreateOSDAWSPage() {
    const URL = await browser.getUrl();
    return (URL === 'https://qa.foo.redhat.com:1337/openshift/create/osd/aws'
    || URL === 'https://prod.foo.redhat.com:1337/openshift/create/osd/aws');
  }
}

export default new CreateOSDAWSPage();
