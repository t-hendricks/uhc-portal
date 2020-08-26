import Page from './page';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class ClusterList extends Page {
  get createClusterBtn() {
    return $("//a[contains(@href, '/openshift/create')]/button[text()='Create cluster'] | //a/span[text()='Create an OpenShift cluster']");
  }

  get emptyStateRegisterClusterLink() {
    return $("//a[contains(@href, '/openshift/register')]/button[text()='Register cluster']");
  }

  get extraActionsKebab() {
    return $("div[data-testid='cluster-list-extra-actions-dropdown'] > button.pf-c-dropdown__toggle");
  }

  get registerClusterItem() {
    return $("button[data-testid='register-cluster-item'");
  }

  async isClusterListPage() {
    const URL = await browser.getUrl();
    return URL.startsWith('https://qa.foo.redhat.com:1337/openshift') || URL.startsWith('https://prod.foo.redhat.com:1337/openshift');
  }

  async isReady() {
    const readyDiv = await $("div[data-ready='true']");
    return readyDiv.isExisting();
  }

  async navigateToRegisterCluster() {
    const extraActionsKebab = await this.extraActionsKebab;
    if (await extraActionsKebab.isExisting()) {
      // kebab exists, so use the menu
      await extraActionsKebab.click();
      await (await this.registerClusterItem).click();
    } else {
      // probably empty state?
      await (await this.emptyStateRegisterClusterLink).click();
    }
  }
}

export default new ClusterList();
