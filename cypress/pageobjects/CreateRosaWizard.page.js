import Page from './page';
import LeaveCreateClusterPrompt from './LeaveCreateClusterPrompt';
import ClusterListPage from './ClusterList.page';
import CreateClusterPage from './CreateCluster.page';

class CreateRosaCluster extends Page {

  clusterDetailsTree = () => cy.get('li.pf-c-wizard__nav-item').find('button').contains('Details');

  machineCIDRInput = () => cy.get('input[id="network_machine_cidr"]');

  serviceCIDRInput = () => cy.get('input[id="network_service_cidr"]');

  podCIDRInput = () => cy.get('input[id="network_pod_cidr"]');

  hostPrefixInput = () => cy.get('input[id="network_host_prefix"]');

  customOperatorPrefixInput = () => cy.get('input[id="custom_operator_roles_prefix"]');

  enableAdditionalEtcdEncryptionCheckbox = () => cy.get('input[id="etcd_encryption"]');

  enableFIPSCryptographyCheckbox = () => cy.get('input[id="fips"]');

  createClusterButton = () => cy.get('button[type="submit"]').contains('Create cluster');

  refreshInfrastructureAWSAccountButton = () => cy.get('button[data-testid="refresh-aws-accounts"]').first();

  refreshBillingAWSAccountButton = () => cy.get('button[data-testid="refresh-aws-accounts"]').second();

  isCreateRosaPage() {
    super.assertUrlIncludes('/openshift/create/rosa/wizard');
  }

  isAccountsAndRolesScreen() {
    cy.contains('h3', 'AWS infrastructure account');
  }

  isClusterDetailsScreen() {
    cy.contains('h3', 'Cluster details');
  }

  isClusterMachinepoolsScreen() {
    cy.contains('h3', 'Default machine pool');
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

  get clusterNameInput() {
    return 'input#name';
  }

  get accountIdMenuItem() {
    return '.pf-c-select__menu-item';
  }

  get associatedAccountsDropdown() {
    return 'button.pf-c-select__toggle:not(.pf-m-disabled)[aria-describedby="aws-infra-accounts"]';
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

  selectHostedControlPlaneTypeOption() {
    cy.getByTestId('hosted-control-planes').click();
    cy.getByTestId('hosted-control-planes').should('have.attr', 'aria-selected').then((isSelected) => {
      expect(isSelected).to.eq('true');
    });
  }

  selectAWSInfrastructureAccount(accountID) {
    cy.get('button').contains('How to associate a new AWS account').siblings().find('div').find('button.pf-c-select__toggle').click();
    cy.get('input.pf-m-search', { timeout: 50000 }).clear().type(accountID);
    cy.get('div[label="Associated AWS infrastructure account"]').find('button').contains(accountID).click();
  }
  waitForARNList() {
    cy.get('span.pf-c-button__progress', { timeout: 80000 }).should('not.exist');
  }

  selectInstallerRole(roleName) {
    cy.get('span').contains('Installer role').parent().parent().siblings().find('div').find('button.pf-c-select__toggle').click();
    cy.get('ul[id="installer_role_arn"]').find('button').contains(roleName).click();
  }
  selectClusterVersion(version) {
    cy.get('div[name="cluster_version"]').find('button.pf-c-select__toggle').click();
    cy.get('ul[label="Version"]').find('button').contains(version).click();
  }

  selectRegion(region) {
    cy.get('select[name="region"]').select(region);
  }

  selectComputeNodeType(computeNodeType) {
    cy.get('label[for="node_type"]').parent().siblings().find('div').find('button.pf-c-select__toggle').click();
    cy.get('li').contains(computeNodeType).click();
  }

  enableAutoScaling() {
    cy.get('input[id="autoscalingEnabled"]').check();
  }

  disabledAutoScaling() {
    cy.get('input[id="autoscalingEnabled"]').uncheck();
  }

  selectComputeNodeCount(count) {
    cy.get('select[name="nodes_compute"]').select(count);
  }

  selectClusterPrivacy(privacy) {
    let privacyRadio = cy.get('input[id="cluster_privacy-external"]');
    if (privacy == "private") {
      privacyRadio.last().check();
    }
    else {
      privacyRadio.first().check();
    }
  }

  selectUpdateStratergy(stratergy) {
    let updateStratergy = cy.get('input[name="upgrade_policy"]');
    if (stratergy == "Recurring updates") {
      updateStratergy.last().check();
    }
    else {
      updateStratergy.first().check();
    }
  }

  selectAvailabilityZone(az) {
    let avilabilityZone = cy.get('input[name="multi_az"]');
    if (az == "Single zone") {
      avilabilityZone.first().check();
    }
    else {
      avilabilityZone.last().check();
    }
  }

  selectRoleProviderMode(mode) {
    let modeRadio = cy.get('input[name="rosa_roles_provider_creation_mode"]');
    if (mode == "Auto") {
      modeRadio.last().check();
    }
    else {
      modeRadio.first().check();
    }
  }

  useCIDRDefaultValues(value = true) {
    let cidrDefaultValuesCheckBox = cy.get('input[id="cidr_default_values_toggle"]');
    if (value) {
      cidrDefaultValuesCheckBox.check();
    }
    else {
      cidrDefaultValuesCheckBox.uncheck();
    }
  }

  selectOIDCConfigID(configID) {
    cy.get('span').contains('Select a config id').click({ force: true });
    cy.get('ul[name="byo_oidc_config_id"]').find('span').contains(configID).click();
  }

  isClusterPropertyMatchesValue(property, value) {
    cy.get('span.pf-c-description-list__text').contains(property).parent().siblings().find('div').contains(value);
  }

}


export default new CreateRosaCluster();
