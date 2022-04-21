/* eslint-disable no-undef */
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

  async waitForInstallCompletion() {
    await (await this.installationSuccessAlert).waitForExist({ timeout: 5 * 60 * 1000 });
    await (await this.accessControlTabBtn).waitForClickable({ timeout: 2.5 * 60 * 1000 });
  }

  get addIDPDropdownToggle() { return $("//button[@id='add-identity-provider']"); }

  get IDPDropdown() { return $("//ul[@aria-labelledby='add-identity-provider']"); }

  get GoogleIDPDropdownItem() { return $("//ul[@aria-labelledby='add-identity-provider']/li/a[contains(text(), 'Google')]"); }

  get addIDPModalConfirm() { return $('div[data-test-id="add-idp-osd-dialog"] ~ footer.pf-c-modal-box__footer > .pf-c-button.pf-m-primary'); }

  get IDPModalBody() { return $('div[data-test-id="add-idp-osd-dialog"]'); }

  get IDPTable() { return $('//table[@aria-label="Identity Providers"]'); }

  firstIDPRowxPath = '//table[@aria-label="Identity Providers"]//tbody/tr[1]';

  firstIDPRowActionsxPath = `${this.firstIDPRowxPath}//button[@aria-label="Actions"]`;

  get firstRowURLCopy() {
    return $(`${this.firstIDPRowxPath}//td[@data-label="Auth callback URL"]//button`);
  }

  get firstRowActions() {
    return $(this.firstIDPRowActionsxPath);
  }

  get firstRowDeleteIDP() {
    return $(`${this.firstIDPRowActionsxPath}//following-sibling::ul[1]//button[contains(text(), "Delete")]`);
  }

  deleteIDPModalxPath = '//ancestor::div[header//*[contains(text(), "Remove identity provider")]]';

  get deleteIDPModal() { return $(this.deleteIDPModalxPath); }

  get deleteIDPModalRemoveBtn() { return $(`${this.deleteIDPModalxPath}//button[text()="Remove"]`); }

  /** Networking tab */
  async navigateToNetworkingTab() {
    await (await this.networkingTabBtn).waitForClickable({ timeout: 0.5 * 60 * 1000 });
    await (await this.networkingTabBtn).click();
  }

  get networkingTabBtn() { return $('button[aria-controls="networkingTabContent"]'); }

  routersCardxPath = '//div[contains(@class, "ocm-c-networking-cluster-ingress__card--body")]';

  get routersCard() { return $(this.routersCardxPath); }

  get copyAPIURLBtn() {
    return $('//h1[contains(text(), "Control Plane API endpoint")]/parent::div/following-sibling::div[1]//button');
  }

  get makeAPIPrivateCheckbox() {
    return $('//h1[contains(text(), "Control Plane API endpoint")]/parent::div/following-sibling::div[2]//input');
  }

  get saveNetworkingChangesBtn() {
    return $(`${this.routersCardxPath}//button[text()="Change settings"]`);
  }

  get enableAdditionalRouterSwitch() {
    return $(`${this.routersCardxPath}//input[@id="enable_additional_router"]/following-sibling::span[@class="pf-c-switch__toggle"]`);
  }

  get makeDefaultRouterPrivateCheckbox() {
    return $('//h2[contains(text(), "Default application router")]/parent::div/following-sibling::div[2]//input');
  }

  get defaultRouterURLCopybox() {
    return $('//h2[contains(text(), "Default application router")]/following::div[@class="pf-c-clipboard-copy__group"]/input');
  }

  get additionalRouterURLCopybox() {
    return $('//h2[contains(text(), "Additional application router")]/following::div[@class="pf-c-clipboard-copy__group"]/input');
  }

  get labelMatchForAdditionalRouterField() {
    return $(`${this.routersCardxPath}//input[@id="labels_additional_router"]`);
  }

  get labelMatchFieldError() {
    return $(`${this.routersCardxPath}//div[@id="labels_additional_router-helper" and contains(@class, "pf-m-error")]`);
  }

  saveNetworkingChangesModalxPath = '//header//*[contains(text(), "Change cluster privacy settings?")]//ancestor::div[@class="pf-c-modal-box"]';

  get saveNetworkingChangesModal() {
    return $(`${this.saveNetworkingChangesModalxPath}`);
  }

  get saveNetworkingChangesModalConfirmBtn() {
    return $(`${this.saveNetworkingChangesModalxPath}//button[text()="Change settings"]`);
  }
}

export default new ClusterDetails();
