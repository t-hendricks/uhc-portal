import Page from './page';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class RegisterCluster extends Page {
  get clusterIDInput() { return $('input#cluster_id'); }

  get clusterIDError() { return $('input#cluster_id ~ div.pf-m-error'); }

  get displayNameInput() { return $('input#display_name'); }

  async isRegisterClusterPage() {
    const URL = await browser.getUrl();
    // eslint-disable-next-line no-return-await
    return URL.endsWith('/openshift/register') && await $('article#register-cluster');
  }
}

export default new RegisterCluster();
