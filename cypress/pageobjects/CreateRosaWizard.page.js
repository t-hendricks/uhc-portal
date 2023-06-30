import Page from './page';
import LeaveCreateClusterPrompt from './LeaveCreateClusterPrompt';
import ClusterListPage from './ClusterList.page';
import CreateClusterPage from './CreateCluster.page';

class CreateRosaCluster extends Page {
  isCreateRosaPage() {
    super.assertUrlIncludes('/openshift/create/rosa/wizard');
  }

  isAccountsAndRolesScreen() {
    cy.contains('h3', 'AWS infrastructure account');
  }

  isControlPlaneTypeScreen() {
    cy.contains('h2', 'Welcome to Red Hat OpenShift Service on AWS (ROSA)');
    cy.contains('h3', 'Select an AWS control plane type');
  }

  isAssociateAccountsDrawer() {
    cy.contains('h2', 'How to associate a new AWS account');
  }

  cancelWizard() {
    cy.contains('button', 'Cancel').click();
  }

  isClusterDetailsScreen() {
    cy.contains('h3', 'Cluster details');
  }

  isMachinePoolScreen() {
    cy.contains('h3', 'Default machine pool');
  }

  isNetworkingScreen() {
    cy.contains('h3', 'Networking configuration');
  }

  isCIDRScreen() {
    cy.contains('h3', 'CIDR ranges');
  }

  isUpdatesScreen() {
    cy.contains('h3', 'Cluster update strategy');
  }

  isReviewScreen() {
    cy.contains('h2', 'Review your dedicated cluster');
  }

  showsNoARNsDetectedAlert() {
    cy.contains('h4', 'Some account roles ARNs were not detected');
  }

  showsNoUserRoleAlert() {
    cy.contains('h4', 'A user-role could not be detected');
  }

  showsNoOcmRoleAlert() {
    cy.contains('h4', 'Cannot detect an OCM role');
  }

  showsFakeClusterBanner = () => cy.contains('On submit, a fake ROSA cluster will be created.');

  showsNoAssociatedAccounts = () => cy.getByTestId('no_associated_accounts').should('be.visible');

  isSelectedVersion = (testVersion) => {
    cy.get('button.pf-c-select__menu-item.pf-m-selected')
      .scrollIntoView()
      .invoke('text')
      .should('eq', testVersion);
  };

  get accountIdMenuItem() {
    return '.pf-c-select__menu-item';
  }

  get associatedAccountsDropdown() {
    return 'button.pf-c-select__toggle';
  }

  get versionsDropdown() {
    return 'div[name="cluster_version"] button.pf-c-select__toggle';
  }

  get ARNFieldRequiredMsg() {
    return '.pf-c-expandable-section.pf-m-expanded .pf-c-form__helper-text.pf-m-error';
  }

  get clusterNameInput() {
    return 'input#name';
  }

  get clusterNameInputError() {
    return 'ul#rich-input-popover-name li.pf-c-helper-text__item.pf-m-error.pf-m-dynamic';
  }

  get primaryButton() {
    return '.rosa-wizard button.pf-c-button.pf-m-primary';
  }

  selectStandaloneControlPlaneTypeOption() {
    cy.getByTestId('standalone-control-planes').click();
    cy.getByTestId('standalone-control-planes')
      .should('have.attr', 'aria-selected')
      .then((isSelected) => {
        expect(isSelected).to.eq('true');
      });
  }
}

export default new CreateRosaCluster();
