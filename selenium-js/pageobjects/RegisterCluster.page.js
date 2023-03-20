import Page from './page';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class RegisterCluster extends Page {
  get clusterIDInput() { return $('input#cluster_id'); }

  get displayNameInput() { return $('input#display_name'); }

  get submitButton() { return $('article#register-cluster button.pf-c-button.pf-m-primary'); }

  async isRegisterClusterPage() {
    const URL = await browser.getUrl();
    // eslint-disable-next-line no-return-await
    return URL.endsWith('/openshift/register') && await $('article#register-cluster');
  }
}

export default new RegisterCluster();
