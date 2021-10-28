import Page from './page';

/**
 * COMRolesAndAccessPage contains the queries for components at
 * "Cluster Details" -> "Access Control" -> "OCM Roles and Access".
 */
class OCMRolesAndAccessPage extends Page {
  get accessControlTabButton() { return $('//button[.//*[contains(text(), "Access control")]]'); }

  get grantRoleButton() { return $('//button[contains(text(), "Grant role")]'); }

  get OCMRolesAndAccessTable() { return $('//table[@aria-label="OCM Roles and Access"]'); }

  get OCMRolesAndAccessTableActionButton() { return $('(//table[@aria-label="OCM Roles and Access"]//button[@aria-label="Actions"])[1]'); }

  get OCMRolesAndAccessTableDeleteButton() { return $('//table[@aria-label="OCM Roles and Access"]//button[@data-key="delete-acton"]'); }

  get grantRoleUserInput() { return $('//input[@id="username"]'); }

  get cannotBeEmptyError() { return $('//*[contains(text(), "Red Hat login cannot be empty")]'); }

  get cannotBeFoundError() { return $('//*[contains(text(), "This Red Hat login could not be found")]'); }

  get submitButton() { return $('//*[@id="ocm-roles-access-dialog"]//button[@type="submit"]'); }

  async usernameCell(username) {
    const result = await $(`//*[text()="${username}"]`);
    return result;
  }
}

export default new OCMRolesAndAccessPage();
