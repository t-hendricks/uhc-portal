import Page from './page';
import LeaveCreateClusterPrompt from './LeaveCreateClusterPrompt';
import ClusterListPage from './ClusterList.page';
import CreateClusterPage from './CreateCluster.page';
import { ThinkPeaksIconConfig } from '@patternfly/react-icons';

class CreateRosaCluster extends Page {

  clusterDetailsTree = () => cy.get('li.pf-c-wizard__nav-item').find('button').contains('Details');

  rosaCreateClusterButton = () => cy.getByTestId('rosa-create-cluster-button');

  rosaClusterWithCLI = () => cy.get('a').contains('With CLI');

  rosaClusterWithWeb = () => cy.get('a').contains('With web interface');

  reviewAndCreateTree = () => cy.get('li.pf-c-wizard__nav-item').find('button').contains('Review and create');

  machineCIDRInput = () => cy.get('input[id="network_machine_cidr"]');

  serviceCIDRInput = () => cy.get('input[id="network_service_cidr"]');

  podCIDRInput = () => cy.get('input[id="network_pod_cidr"]');

  hostPrefixInput = () => cy.get('input[id="network_host_prefix"]');

  customOperatorPrefixInput = () => cy.get('input[id="custom_operator_roles_prefix"]');

  singleZoneAvilabilityRadio = () => cy.getByTestId('multi_az-false');

  multiZoneAvilabilityRadio = () => cy.getByTestId('multi_az-true');

  advancedEncryptionLink = () => cy.get('span').contains('Advanced Encryption');

  enableAdditionalEtcdEncryptionCheckbox = () => cy.get('input[id="etcd_encryption"]');

  enableFIPSCryptographyCheckbox = () => cy.get('input[id="fips"]');

  useBothIMDSv1AndIMDSv2Radio = () => cy.getByTestId("imds-optional");

  useIMDSv2Radio = () => cy.getByTestId("imds-required");

  rootDiskSizeInput = () => cy.get('input[name="worker_volume_size_gib"]');

  editNodeLabelLink = () => cy.get('span').contains('Add node labels');

  addAdditionalLabelLink = () => cy.get('.reduxFormKeyValueList-addBtn');

  createClusterButton = () => cy.get('button[type="submit"]').contains('Create cluster');

  refreshInfrastructureAWSAccountButton = () => cy.get('button[data-testid="refresh-aws-accounts"]').first();

  refreshBillingAWSAccountButton = () => cy.get('button[data-testid="refresh-aws-accounts"]').second();

  supportRoleInput = () => cy.get('input[id="support_role_arn"]');

  workerRoleInput = () => cy.get('input[id="worker_role_arn"]');

  controlPlaneRoleInput = () => cy.get('input[id="control_plane_role_arn"]');

  minimumNodeInput = () => cy.get('input[aria-label="Minimum nodes"]');

  maximumNodeInput = () => cy.get('input[aria-label="Maximum nodes"]');

  minimumNodeCountMinusButton = () => this.minimumNodeInput().prev();

  minimumNodeCountPlusButton = () => this.minimumNodeInput().next();

  maximumNodeCountMinusButton = () => this.maximumNodeInput().prev();

  maximumNodeCountPlusButton = () => this.maximumNodeInput().next();

  cidrDefaultValuesCheckBox = () => cy.get('input[id="cidr_default_values_toggle"]');

  createModeAutoRadio = () => cy.getByTestId('rosa_roles_provider_creation_mode-auto');

  createModeManualRadio = () => cy.getByTestId('rosa_roles_provider_creation_mode-manual');

  applicationIngressDefaultSettingsRadio = () => cy.getByTestId('applicationIngress-default');

  applicationIngressCustomSettingsRadio = () => cy.getByTestId('applicationIngress-custom');

  clusterPrivacyPublicRadio = () => cy.getByTestId('cluster_privacy-external');

  clusterPrivacyPrivateRadio = () => cy.getByTestId('cluster_privacy-internal');

  recurringUpdateRadio = () => cy.getByTestId('upgrade_policy-automatic');

  individualUpdateRadio = () => cy.getByTestId('upgrade_policy-manual');


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
    cy.contains('continue to step');
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

  addNodeLabelKeyAndValue(key, value = '', index = 0) {
    cy.get('input[name="node_labels[' + index + '].key"]').clear().type(key);
    cy.get('input[name="node_labels[' + index + '].value"]').clear().type(value);

  }
  isNodeLabelKeyAndValue(key, value = '', index = 0) {
    cy.get('input[name="node_labels[' + index + '].key"]').should('have.value', key);
    cy.get('input[name="node_labels[' + index + '].value"]').should('have.value', value);

  }
  selectRegion(region) {
    cy.get('select[name="region"]').select(region);
  }

  selectComputeNodeType(computeNodeType) {
    cy.get('label[for="node_type"]').parent().siblings().find('div').find('button.pf-c-select__toggle').click();
    cy.get('li').contains(computeNodeType).click();
  }

  selectGracePeriod(gracePeriod) {
    cy.get('button[aria-label="Options menu"]').click();
    cy.get('button').contains(gracePeriod).click();
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
    if (privacy == "private") {
      this.clusterPrivacyPrivateRadio().check();
    }
    else {
      this.clusterPrivacyPublicRadio().check();
    }
  }

  selectUpdateStratergy(stratergy) {
    if (stratergy == "Recurring updates") {
      this.recurringUpdateRadio().check();
    }
    else {
      this.individualUpdateRadio().check();
    }
  }

  selectAvailabilityZone(az) {
    if (az == "Single zone") {
      this.singleZoneAvilabilityRadio().check();
    }
    else {
      this.multiZoneAvilabilityRadio().check();
    }
  }

  selectRoleProviderMode(mode) {
    if (mode == "Auto") {
      this.createModeAutoRadio().check();
    }
    else {
      this.createModeManualRadio().check();
    }
  }

  useCIDRDefaultValues(value = true) {
    if (value) {
      this.cidrDefaultValuesCheckBox().check();
    }
    else {
      this.cidrDefaultValuesCheckBox().uncheck();
    }
  }

  selectOIDCConfigID(configID) {
    cy.get('span').contains('Select a config id').click({ force: true });
    cy.get('ul[name="byo_oidc_config_id"]').find('span').contains(configID).click();
  }

  isClusterPropertyMatchesValue(property, value) {
    cy.get('span.pf-c-description-list__text').contains(property).parent().siblings().find('div').contains(value);
  }



  setMinimumNodeCount(nodeCount) {
    this.minimumNodeInput().type('{selectAll}').type(nodeCount);

  }
  setMaximumNodeCount(nodeCount) {
    this.maximumNodeInput().type('{selectAll}').type(nodeCount);
  }
}


export default new CreateRosaCluster();
