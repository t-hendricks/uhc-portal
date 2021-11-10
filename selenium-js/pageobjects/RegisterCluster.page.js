import Page from './page';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class RegisterCluster extends Page {
  get clusterIDInput() { return $('input#cluster_id'); }

  get clusterURLInput() { return $('input#web_console_url'); }

  get displayNameInput() { return $('input#display_name'); }

  get clusterIDError() { return $('input#cluster_id ~ div.pf-m-error'); }

  get clusterURLError() { return $('input#web_console_url ~ div.pf-m-error'); }

  get displayNameError() { return $('input#display_name ~ div.pf-m-error'); }

  get submitButton() { return $('article#register-cluster button.pf-c-button.pf-m-primary'); }

  get cancelButton() { return $('article#register-cluster button.pf-c-button.pf-m-secondary'); }

  async isRegisterClusterPage() {
    const URL = await browser.getUrl();
    // eslint-disable-next-line no-return-await
    return URL.endsWith('/openshift/register') && await $('article#register-cluster');
  }
}

export default new RegisterCluster();
