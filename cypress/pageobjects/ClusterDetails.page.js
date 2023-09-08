import PropTypes from 'prop-types';
import Page from './page';

class ClusterDetails extends Page {
  isClusterDetailsPage = (displayName) => cy.contains('h1', displayName, { timeout: 10000 });

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
    cy.get('span[id="cl-details-btns"]').contains('button', 'Unarchive', { timeout: 15000 });

  waitForUnarchiveClusterModalToLoad = () => {
    cy.getByTestId(' unarchive-cluster-dialog', { timeout: 30000 }).should('be.visible');
    cy.contains('button', 'Unarchive cluster').should('be.visible');
  };

  unarchiveClusterDialogConfirm = () => cy.contains('button', 'Unarchive cluster');

  deleteClusterDropdownItem = () => cy.contains('button', 'Delete cluster');

  deleteClusterNameInput = () => cy.get('input[aria-label="cluster name"]');

  deleteClusterConfirm = () => cy.get('div[aria-label="Delete cluster"]').find('footer').find('button').first();

  clusterNameTitle = () => cy.get('h1.cl-details-page-title');

  clusterTypeLabelValue = () => cy.getByTestId('clusterType').should('exist');

  clusterRegionLabelValue = () => cy.getByTestId('region').should('exist');

  clusterAvailabilityLabelValue = () => cy.getByTestId('availability').should('exist');

  clusterAutoScalingStatus = () => cy.getByTestId('clusterAutoscalingStatus').should('exist');

  clusterIMDSValue = () => cy.getByTestId('instanceMetadataService').should('exist');

  clusterFipsCryptographyStatus = () => cy.getByTestId('fipsCryptographyStatus').should('exist');

  clusterAdditionalEncryptionStatus = () => cy.getByTestId('etcEncryptionStatus').should('exist');

  clusterInfrastructureAWSaccountLabelValue = () => cy.getByTestId('infrastructureAWSAccount').should('exist');

  clusterMachineCIDRLabelValue = () => cy.getByTestId('machineCIDR').should('exist');

  clusterServiceCIDRLabelValue = () => cy.getByTestId('serviceCIDR').should('exist');

  clusterPodCIDRLabelValue = () => cy.getByTestId('podCIDR').should('exist');

  clusterHostPrefixLabelValue = () => cy.getByTestId('hostPrefix').should('exist');


  waitForEditUrlModalToLoad = () => {
    cy.getByTestId('edit-console-url-dialog', { timeout: 30000 }).should('be.visible');
    cy.get('input[id="edit-console-url-input"]', { timeout: 30000 }).should('be.visible');
  };

  clusterDetailsPageRefresh() {
    cy.get('button[aria-label="Refresh"]').click();
  }

  waitForEditUrlModalToClear = () => {
    cy.getByTestId('edit-console-url-dialog', { timeout: 30000 }).should('not.exist');
  };

  waitForEditDisplayNamelModalToLoad = () => {
    cy.getByTestId('edit-displayname-modal', { timeout: 30000 }).should('be.visible');
    cy.get('input[id="edit-display-name-input"]', { timeout: 30000 }).should('exist');
  };

  waitForEditDisplayNameModalToClear = () => {
    cy.getByTestId('edit-displayname-modal', { timeout: 30000 }).should('not.exist');
  };

  waitForDisplayNameChange = (displayName) => {
    cy.get('h1.cl-details-page-title', { timeout: 30000 }).should('not.have.text', displayName);
  };

  waitForArchiveClusterModalToLoad = () => {
    cy.getByTestId('archive-cluster-dialog', { timeout: 30000 }).should('be.visible');
    cy.contains('button', 'Archive cluster', { timeout: 30000 }).should('exist');
  };

  waitForClusterDetailsLoad = () => {
    cy.get('div.ins-c-spinner.cluster-details-spinner', { timeout: 30000 }).should('not.exist');
  };

  waitForAccountSetupToSuccess() {
    cy.get('li[id="awsAccountSetup"]', { timeout: 80000 }).should('have.class', 'pf-m-success');
    this.checkInstallationStepStatus('Account setup', 'Completed');
  }

  waitForOidcAndOperatorRolesSetupToSuccess() {
    cy.get('li[id="oidcAndOperatorRolesSetup"]', { timeout: 80000 }).should('have.class', 'pf-m-success');
    this.checkInstallationStepStatus('OIDC and operator roles', 'Completed');
  }

  waitForDNSSetupToSuccess() {
    cy.get('li[id="DNSSetup"]', { timeout: 80000 }).should('have.class', 'pf-m-success');
    this.checkInstallationStepStatus('DNS setup', 'Completed');
  }

  waitForClusterInstallationToSuccess() {
    cy.get('li[id="clusterInstallation"]', { timeout: 80000 }).should('have.class', 'pf-m-success');
    this.checkInstallationStepStatus('Cluster installation', 'Completed');
  }

  checkInstallationStepStatus(step, status = '') {
    let installStep = cy.get('div.pf-c-progress-stepper__step-title').contains(step);
    if (status == "") {
      installStep.should('be.visible');
    }
    else {
      installStep.siblings().find('div').contains(status);
    }
  }

  waitForInstallerScreenToLoad = () => {
    cy.get('.pf-c-spinner', { timeout: 30000 }).should('not.exist');
    cy.get('div.cluster-loading-container', { timeout: 100000 }).should('not.exist');
  };

  waitForDeleteClusterActionComplete = () => {
    cy.getByTestId('delete-cluster-dialog').get('div.ins-c-spinner', { timeout: 100000 }).should('not.exist');
  };
}


ClusterDetails.propTypes = {
  displayName: PropTypes.string.isRequired,
};

export default new ClusterDetails();
