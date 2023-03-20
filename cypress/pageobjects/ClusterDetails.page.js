import PropTypes from 'prop-types';
import Page from './page';

class ClusterDetails extends Page {
  isClusterDetailsPage = (displayName) => cy.contains('h1', displayName);

  addConsoleURLButton = () => cy.get('button').contains('Add console URL');

  editConsoleURLDialogInput = () => cy.get('input[id="edit-console-url-input"]');

  editConsoleURLDialogConfirm = () => cy.get('button').contains('Add URL');

  openConsoleLink = () => cy.getByTestId('console-url-link');

  actionsDropdownToggle = () =>
    cy.getByTestId('cluster-actions-dropdown').find('button').first();

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
}

ClusterDetails.propTypes = {
  displayName: PropTypes.string.isRequired,
  delayed: PropTypes.bool,
};

export default new ClusterDetails();
