import PropTypes from 'prop-types';
import Page from './page';

class ClusterDetails extends Page {
  isClusterDetailsPage = (displayName) => cy.contains('h1', displayName);

  addConsoleURLButton = () => cy.get('button').contains('Add console URL');

  openConsoleButton = () => cy.getByTestId('console-url-link').find('button').first();

  editConsoleURLDialogInput = () => cy.get('input[id="edit-console-url-input"]');

  editConsoleURLDialogConfirm = () =>
    cy
      .get('div[aria-label="Add console URL"]')
      .find('footer')
      .find('button')
      .first()
      .contains('Add URL');

  openConsoleLink = () => cy.getByTestId('console-url-link');

  actionsDropdownToggle = () => cy.getByTestId('cluster-actions-dropdown').find('button').first();

  editDisplayNameDropdownItem = () => cy.contains('button', 'Edit display name');

  editDisplayNameInput = () => cy.get('input[id="edit-display-name-input"]');

  editDisplaynameConfirm = () =>
    cy.get('div[aria-label="Edit display name"]').find('footer').find('button').first();

  archiveClusterDropdownItem = () => cy.contains('button', 'Archive cluster');

  archiveClusterDialogConfirm = () =>
    cy.get('div[aria-label="Archive cluster"]').find('footer').find('button').first();

  successNotification = () => cy.get('div.pf-c-alert.pf-m-success.notification-item');

  unarchiveClusterButton = () =>
    cy.get('span[id="cl-details-btns"]').contains('button', 'Unarchive');

  unarchiveClusterDialogConfirm = () => cy.contains('button', 'Unarchive cluster');

  clusterNameTitle = () => cy.get('h1.cl-details-page-title');

  waitForEditUrlModalToLoad = () => {
    cy.get('input[id="edit-console-url-input"]', { timeout: 30000 }).should('exist');
  };

  waitForEditUrlModalToClear = () => {
    cy.getByTestId('edit-console-url-dialog', { timeout: 30000 }).should('not.exist');
  };

  waitForEditDisplayNamelModalToLoad = () => {
    cy.get('input[id="edit-display-name-input"]', { timeout: 30000 }).should('exist');
  };

  waitForEditDisplayNamelModalToClear = () => {
    cy.getByTestId('edit-displayname-modal', { timeout: 30000 }).should('not.exist');
  };

  waitForDisplayNameChange = (displayName) => {
    cy.get('h1.cl-details-page-title', { timeout: 30000 }).should('not.equal', displayName);
  };

  waitForClusterDetailsLoad = () => {
    cy.get('div.ins-c-spinner.cluster-details-spinner', { timeout: 30000 }).should('not.exist');
  };
}

ClusterDetails.propTypes = {
  displayName: PropTypes.string.isRequired,
};

export default new ClusterDetails();
