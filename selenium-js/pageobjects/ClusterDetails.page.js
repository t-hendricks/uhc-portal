import Page from './page';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class ClusterDetails extends Page {
  async isClusterDetailsPage(clusterID = null) {
    const URL = await browser.getUrl();
    if (!clusterID) {
      // eslint-disable-next-line no-return-await
      return URL.indexOf('/openshift/details') !== -1 && await $('section#clusterdetails-content');
    }
    // eslint-disable-next-line no-return-await
    return URL.indexOf(`/openshift/details/${clusterID}`) !== -1 && await $('section#clusterdetails-content');
  }

  /** Details top */
  get actionsDropdownToggle() { return $('div[data-test-id="cluster-actions-dropdown"] > button'); }

  get clusterNameTitle() { return $('h1.cl-details-page-title'); }

  get successNotification() { return $('.pf-c-alert.pf-m-success.notification-item'); }

  get openConsoleButton() { return $('//button[contains(text(),\'Open console\')]'); }

  /** Actions and their modals */
  // Archive cluster
  get archiveClusterDropdownItem() { return $("//button[contains(text(),'Archive cluster')]"); }

  get archiveClusterDialogConfirm() { return $('div[data-test-id="archive-cluster-dialog"] ~ footer.pf-c-modal-box__footer > .pf-c-button.pf-m-primary'); }

  // Unarchive cluster
  get unarchiveClusterDialogConfirm() { return $('div[data-test-id="unarchive-cluster-dialog"] ~ footer.pf-c-modal-box__footer > .pf-c-button.pf-m-primary'); }

  get unarchiveClusterButton() { return $('//button[contains(text(),\'Unarchive\')]'); }

  // Add console URL
  get addConsoleURLButton() { return $("//button[contains(text(),'Add console URL')]"); }

  get editConsoleURLDialogInput() { return $('#edit-console-url-input'); }

  get editConsoleURLDialogConfirm() { return $('div[data-test-id="edit-console-url-dialog"] ~ footer.pf-c-modal-box__footer > .pf-c-button.pf-m-primary'); }

  // Edit display name
  get editDisplayNameDropdownItem() { return $("//button[contains(text(),'Edit display name')]"); }

  get editDisplayNameInput() { return $('input#edit-display-name-input'); }

  get editDisplaynameConfirm() { return $('div[data-test-id="edit-displayname-modal"] ~ footer.pf-c-modal-box__footer > .pf-c-button.pf-m-primary'); }

  // Delete cluster
  get deleteClusterDropdownItem() { return $("//button[contains(text(),'Delete cluster')]"); }

  get deleteClusterDialogInput() { return $('div[data-test-id="delete-cluster-dialog"] input'); }

  get deleteClusterDialogConfirm() { return $('div[data-test-id="delete-cluster-dialog"] ~ footer.pf-c-modal-box__footer > .pf-c-button.pf-m-danger'); }

  /** Overview tab */
  get installationSuccessAlert() { return $('div[aria-label="Success Alert"]'); }

  /** Access control tab */
  get accessControlTabBtn() { return $('button[aria-controls="accessControlTabContent"]'); }

  get addIDPButton() { return $("//button[contains(text(),'Add identity provider')]"); }

  get addIDPModalConfirm() { return $('div[data-test-id="add-idp-osd-dialog"] ~ footer.pf-c-modal-box__footer > .pf-c-button.pf-m-primary'); }

  get IDPModalBody() { return $('div[data-test-id="add-idp-osd-dialog"]'); }

  get IDPSelection() { return $('div[data-test-id="add-idp-osd-dialog"] > select#type'); }

  get IDPNameInput() { return $('div[data-test-id="add-idp-osd-dialog"] > input#name'); }

  IDPModalRequiredFields() {
    const allInputs = this.IDPModalBody().$$('input');
    return allInputs.filter(input => input.hasAttribute('required'));
  }
}

export default new ClusterDetails();
