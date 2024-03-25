import Page from './page';

class CreateOSDCluster extends Page {
  isCreateOSDPage() {
    super.assertUrlIncludes('/openshift/create/osd');
  }

  isCreateOSDTrialPage() {
    super.assertUrlIncludes('trial=osd');
  }

  isBillingModelScreen() {
    cy.contains('h2', 'Welcome to Red Hat OpenShift Dedicated');
  }

  isCloudProviderSelectionScreen() {
    cy.contains('h3', 'Select a cloud provider');
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

  showsFakeClusterBanner = () =>
    cy.contains('div', 'On submit, a fake OSD cluster will be created.');

  osdCreateClusterButton = () => cy.getByTestId('osd-create-cluster-button');

  subscriptionTypeFreeTrailRadio = () =>
    cy.get('input[name="billing_model"][value="standard-trial"]');

  subscriptionTypeAnnualFixedCapacityRadio = () =>
    cy.get('input[name="billing_model"][value="standard"]');

  subscriptionTypeOnDemandFlexibleRadio = () =>
    cy.get('input[name="billing_model"][value="marketplace-select"]');

  infrastructureTypeRedHatCloudAccountRadio = () =>
    cy.get('input[id="form-radiobutton-byoc-false-field"]');

  infrastructureTypeClusterCloudSubscriptionRadio = () =>
    cy.get('input[id="form-radiobutton-byoc-true-field"]');

  awsCloudProviderCard = () => cy.getByTestId('aws-provider-card');

  gcpCloudProviderCard = () => cy.getByTestId('gcp-provider-card');

  clusterDetailsTree = () => cy.get('button[id="cluster-settings-details"]').contains('Details');

  acknowlegePrerequisitesCheckbox = () => cy.get('input[id="acknowledge_prerequisites"]');

  singleZoneAvilabilityRadio = () => cy.get('input[id="form-radiobutton-multi_az-false-field"]');

  multiZoneAvilabilityRadio = () => cy.get('input[id="form-radiobutton-multi_az-true-field"]');

  enableSecureBootSupportForSchieldedVMsCheckbox = () => cy.get('input[id="secure_boot"]');

  advancedEncryptionLink = () => cy.get('span').contains('Advanced Encryption');

  enableAdditionalEtcdEncryptionCheckbox = () => cy.get('input[id="etcd_encryption"]');

  enableFIPSCryptographyCheckbox = () => cy.get('input[id="fips"]');

  computeNodeCountSelect = () => cy.get('select[name="nodes_compute"]');

  computeNodeCountDetailsText = () => cy.getByTestId('compute-node-multizone-details');

  addNodeLabelLink = () => cy.get('span').contains('Add node labels');

  clusterPrivacyPublicRadio = () =>
    cy.get('input[id="form-radiobutton-cluster_privacy-external-field"]');

  clusterPrivacyPrivateRadio = () =>
    cy.get('input[id="form-radiobutton-cluster_privacy-internal-field"]');

  machineCIDRInput = () => cy.get('input[id="network_machine_cidr"]');

  serviceCIDRInput = () => cy.get('input[id="network_service_cidr"]');

  podCIDRInput = () => cy.get('input[id="network_pod_cidr"]');

  hostPrefixInput = () => cy.get('input[id="network_host_prefix"]');

  cidrDefaultValuesCheckBox = () => cy.get('input[id="cidr_default_values_enabled"]');

  subscriptionTypeValue = () => cy.getByTestId('Subscription-type').find('div');

  infrastructureTypeValue = () => cy.getByTestId('Infrastructure-type').find('div');

  cloudProviderValue = () => cy.getByTestId('Cloud-provider').find('div');

  clusterNameValue = () => cy.getByTestId('Cluster-name').find('div');

  versionValue = () => cy.getByTestId('Version').find('div');

  regionValue = () => cy.getByTestId('Region').find('div');

  securebootSupportForShieldedVMsValue = () =>
    cy.getByTestId('Secure-Boot-support-for-Shielded-VMs').find('div');

  availabilityValue = () => cy.getByTestId('Availability').find('div');

  userWorkloadMonitoringValue = () => cy.getByTestId('User-workload-monitoring').find('div');

  persistentStorageValue = () => cy.getByTestId('Persistent-storage').find('div');

  encryptVolumesWithCustomerkeysValue = () =>
    cy.getByTestId('Encrypt-volumes-with-customer-keys').find('div');

  additionalEtcdEncryptionValue = () => cy.getByTestId('Additional-etcd-encryption').find('div');

  fipsCryptographyValue = () => cy.getByTestId('FIPS-cryptography').find('div');

  nodeInstanceTypeValue = () => cy.getByTestId('Node-instance-type').find('div');

  autoscalingValue = () => cy.getByTestId('Autoscaling').find('div');

  computeNodeCountValue = () => cy.getByTestId('Compute-node-count').find('div');

  nodeLabelsValue = () => cy.getByTestId('Node-labels').find('span');

  clusterPrivacyValue = () => cy.getByTestId('Cluster-privacy').find('div');

  machineCIDRValue = () => cy.getByTestId('Machine-CIDR').find('div');

  serviceCIDRValue = () => cy.getByTestId('Service-CIDR').find('div');

  podCIDRValue = () => cy.getByTestId('Pod-CIDR').find('div');

  hostPrefixValue = () => cy.getByTestId('Host-prefix').find('div');

  installIntoExistingVpcValue = () => cy.getByTestId('Install-into-existing-VPC').find('div');

  applicationIngressValue = () => cy.getByTestId('Application-ingress').find('div');

  updateStratergyValue = () => cy.getByTestId('Update-strategy').find('div');

  nodeDrainingValue = () => cy.getByTestId('Node-draining').find('div');

  createClusterButton = () => cy.get('button').contains('Create cluster');

  get clusterNameInput() {
    return 'input#name';
  }

  get clusterNameInputError() {
    return 'ul#rich-input-popover-name li.pf-v5-c-helper-text__item.pf-m-error.pf-m-dynamic';
  }

  get primaryButton() {
    return '#osd-wizard button.pf-v5-c-button.pf-m-primary';
  }

  get CCSSelected() {
    return 'input:checked[name="byoc"][value="true"]';
  }

  get TrialSelected() {
    return 'input:checked[name="billing_model"][value="standard-trial"]';
  }

  get billingModelRedHatCloudAccountOption() {
    return 'input[id="form-radiobutton-byoc-false-field"]';
  }

  useCIDRDefaultValues(value = true) {
    if (value) {
      this.cidrDefaultValuesCheckBox().check();
    } else {
      this.cidrDefaultValuesCheckBox().uncheck();
    }
  }

  selectClusterPrivacy(privacy) {
    if (privacy.toLowerCase() == 'private') {
      this.clusterPrivacyPrivateRadio().check();
    } else {
      this.clusterPrivacyPublicRadio().check();
    }
  }

  selectSubscriptionType(subscriptionType) {
    if (subscriptionType.toLowerCase().includes('on-demand')) {
      this.subscriptionTypeOnDemandFlexibleRadio().check();
    } else if (subscriptionType.toLowerCase().includes('annual')) {
      this.subscriptionTypeAnnualFixedCapacityRadio().check();
    } else {
      this.subscriptionTypeFreeTrailRadio().check();
    }
  }

  selectInfrastructureType(infrastructureType) {
    if (infrastructureType.toLowerCase().includes('customer cloud')) {
      this.infrastructureTypeClusterCloudSubscriptionRadio().check();
    } else {
      this.infrastructureTypeRedHatCloudAccountRadio().check();
    }
  }

  selectMarketplaceSubscription(marketplace) {
    cy.get('div[name="marketplace_selection"]').find('button').click();
    cy.get('button').contains(marketplace).click();
  }

  selectCloudProvider(cloudProvider) {
    if (cloudProvider.toLowerCase() == 'aws') {
      this.awsCloudProviderCard().click();
    } else {
      this.gcpCloudProviderCard().click();
    }
  }

  selectRegion(region) {
    cy.get('select[name="region"]').select(region);
  }

  selectAvailabilityZone(az) {
    if (az == 'Single zone') {
      this.singleZoneAvilabilityRadio().check();
    } else {
      this.multiZoneAvilabilityRadio().check();
    }
  }

  enableSecureBootSupportForSchieldedVMs(enable) {
    if (enable) {
      this.enableSecureBootSupportForSchieldedVMsCheckbox().check();
    } else {
      this.enableSecureBootSupportForSchieldedVMsCheckbox().uncheck();
    }
  }

  enableAdditionalEtcdEncryption(enable, fipsCryptography = false) {
    this.advancedEncryptionLink().click();

    if (enable) {
      this.enableAdditionalEtcdEncryptionCheckbox().check();
      if (fipsCryptography) {
        this.enableFIPSCryptographyCheckbox().check();
      }
    } else {
      this.enableFIPSCryptographyCheckbox().uncheck();
    }
  }

  selectComputeNodeType(computeNodeType) {
    cy.get('button[aria-label="Machine type select toggle"]').click();
    cy.get('input[aria-label="Machine type select search field"]').clear().type(computeNodeType);
    cy.get('div').contains(computeNodeType).click();
  }

  hideClusterNameValidation() {
    // Validation popup on cluster name field create flaky situation on below version field.
    // To remove the validation popup a click action in cluster left tree required.
    this.clusterDetailsTree().click();
  }

  selectComputeNodeCount(nodeCount) {
    this.computeNodeCountSelect().select(`${nodeCount.toString()}`, { force: true });
  }

  addNodeLabelKeyAndValue(key, value = '', index = 0) {
    cy.get(`input[id="node_labels.${index}.key"]`).clear().type(key);
    cy.get(`input[id="node_labels.${index}.value"]`).clear().type(value);
  }

  uploadGCPServiceAccountJSON(jsonContent) {
    cy.get('textarea[aria-label="File upload"]')
      .clear()
      .invoke('val', jsonContent)
      .trigger('input');
    cy.get('textarea[aria-label="File upload"]').type(' {backspace}');
  }
}

export default new CreateOSDCluster();
