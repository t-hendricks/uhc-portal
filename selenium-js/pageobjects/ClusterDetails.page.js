import Page from './page';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class ClusterDetails extends Page {
  async isClusterDetailsPage(clusterID) {
    const URL = await browser.getUrl();
    // eslint-disable-next-line no-return-await
    return URL.endsWith(`/openshift/details/${clusterID}`) !== -1 && await $('section#clusterdetails-content');
  }

  get actionsDropdownToggle() { return $('div[data-test-id="cluster-actions-dropdown"] > button'); }

  get archiveClusterDropdownItem() { return $("//button[contains(text(),'Archive cluster')]"); }

  get archiveClusterDialogConfirm() { return $('div[data-test-id="archive-cluster-dialog"] ~ footer.pf-c-modal-box__footer > .pf-c-button.pf-m-primary'); }

  get unarchiveClusterDialogConfirm() { return $('div[data-test-id="unarchive-cluster-dialog"] ~ footer.pf-c-modal-box__footer > .pf-c-button.pf-m-primary'); }

  get successNotification() { return $('.pf-c-alert.pf-m-success.notification-item'); }

  get unarchiveClusterButton() { return $('//button[contains(text(),\'Unarchive\')]'); }
}

export default new ClusterDetails();
