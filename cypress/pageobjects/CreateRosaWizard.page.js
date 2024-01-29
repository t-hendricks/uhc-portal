import Page from './page';

class CreateRosaCluster extends Page {
  clusterDetailsTree = () =>
    cy.get('li.pf-v5-c-wizard__nav-item').find('button').contains('Details');

  rosaCreateClusterButton = () => cy.getByTestId('rosa-create-cluster-button');

  rosaClusterWithCLI = () => cy.get('a').contains('With CLI');

  rosaClusterWithWeb = () => cy.get('a').contains('With web interface');

  reviewAndCreateTree = () =>
    cy.get('li.pf-v5-c-wizard__nav-item').find('button').contains('Review and create');

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

  useBothIMDSv1AndIMDSv2Radio = () => cy.getByTestId('imds-optional');

  useIMDSv2Radio = () => cy.getByTestId('imds-required');

  rootDiskSizeInput = () => cy.get('input[name="worker_volume_size_gib"]');

  editNodeLabelLink = () => cy.get('span').contains('Add node labels');

  addAdditionalLabelLink = () => cy.get('.reduxFormKeyValueList-addBtn');

  createClusterButton = () => cy.get('button[type="submit"]').contains('Create cluster');

  refreshInfrastructureAWSAccountButton = () =>
    cy.get('button[data-testid="refresh-aws-accounts"]').first();

  refreshBillingAWSAccountButton = () =>
    cy.get('button[data-testid="refresh-aws-accounts"]').second();

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
    cy.get('button.pf-v5-c-select__menu-item.pf-m-selected')
      .scrollIntoView()
      .invoke('text')
      .should('eq', testVersion);
  };

  get clusterNameInput() {
    return 'input#name';
  }

  get accountIdMenuItem() {
    return '.pf-v5-c-select__menu-item';
  }

  get associatedAccountsDropdown() {
    return 'button.pf-v5-c-select__toggle:not(.pf-m-disabled)[aria-describedby="aws-infra-accounts"]';
  }

  get versionsDropdown() {
    return 'div[name="cluster_version"] button.pf-v5-c-select__toggle';
  }

  get ARNFieldRequiredMsg() {
    return '.pf-v5-c-expandable-section.pf-m-expanded .pf-v5-c-helper-text__item.pf-m-error';
  }

  get clusterNameInput() {
    return 'input#name';
  }

  get clusterNameInputError() {
    return 'ul#rich-input-popover-name li.pf-v5-c-helper-text__item.pf-m-error.pf-m-dynamic';
  }

  get primaryButton() {
    return '.rosa-wizard button.pf-v5-c-button.pf-m-primary';
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
    cy.getByTestId('hosted-control-planes')
      .should('have.attr', 'aria-selected')
      .then((isSelected) => {
        expect(isSelected).to.eq('true');
      });
  }

  selectAWSInfrastructureAccount(accountID) {
    cy.get('button')
      .contains('How to associate a new AWS account')
      .siblings()
      .find('div')
      .find('button.pf-v5-c-select__toggle')
      .click();
    cy.get('input[placeholder*="Filter by account ID"]', { timeout: 50000 })
      .clear()
      .type(accountID);
    cy.get('div[label="Associated AWS infrastructure account"]')
      .find('button')
      .contains(accountID)
      .click();
  }
  waitForARNList() {
    cy.get('span.pf-v5-c-button__progress', { timeout: 80000 }).should('not.exist');
  }

  selectInstallerRole(roleName) {
    cy.get('.pf-v5-c-form__label-text')
      .contains('Installer role')
      .parent()
      .parent()
      .siblings()
      .find('div')
      .find('button.pf-v5-c-select__toggle')
      .then(($btn) => {
        if ($btn.is(':disabled')) {
          cy.log('Installer ARN button is disabled there is only one option. Continuing..');
        } else {
          cy.get('.pf-v5-c-form__label-text')
            .contains('Installer role')
            .parent()
            .parent()
            .siblings()
            .find('div')
            .find('button.pf-v5-c-select__toggle')
            .click();
          cy.get('ul[id="installer_role_arn"]').find('button').contains(roleName).click();
        }
      });
  }
  selectClusterVersion(version) {
    cy.get('div[name="cluster_version"]').find('button.pf-v5-c-select__toggle').click();
    cy.get('ul[label="Version"]').find('button').contains(version).click();
  }

  addNodeLabelKeyAndValue(key, value = '', index = 0) {
    cy.get('input[name="node_labels[' + index + '].key"]')
      .clear()
      .type(key);
    cy.get('input[name="node_labels[' + index + '].value"]')
      .clear()
      .type(value);
  }
  isNodeLabelKeyAndValue(key, value = '', index = 0) {
    cy.get('input[name="node_labels[' + index + '].key"]').should('have.value', key);
    cy.get('input[name="node_labels[' + index + '].value"]').should('have.value', value);
  }
  selectRegion(region) {
    cy.get('select[name="region"]').select(region);
  }

  selectComputeNodeType(computeNodeType) {
    cy.get('label[for="node_type"]')
      .parent()
      .siblings()
      .find('div')
      .find('button.pf-v5-c-select__toggle')
      .click();
    cy.get('li').contains(computeNodeType).click();
  }

  selectGracePeriod(gracePeriod) {
    cy.get('button[aria-label="Options menu"]').click();
    cy.get('button').contains(gracePeriod).click();
  }

  enableAutoScaling() {
    cy.get('input[id="autoscalingEnabled"]').check();
  }

  inputMinNodeCount(minNodeCount) {
    cy.get('[aria-label="Minimum nodes"]').clear().type(`{rightArrow}${minNodeCount}`);
    cy.get('body').click();
    cy.get('[aria-label="Minimum nodes"]').should('have.value', Cypress.env('MIN_NODE_COUNT'));
  }

  inputMaxNodeCount(maxNodeCount) {
    cy.get('[aria-label="Maximum nodes"]').clear().type(`{rightArrow}${maxNodeCount}`);
    cy.get('body').click();
    cy.get('[aria-label="Maximum nodes"]').should('have.value', maxNodeCount);
  }

  disabledAutoScaling() {
    cy.get('input[id="autoscalingEnabled"]').uncheck();
  }

  selectComputeNodeCount(count) {
    cy.get('select[name="nodes_compute"]').select(count);
  }

  selectClusterPrivacy(privacy) {
    if (privacy == 'private') {
      this.clusterPrivacyPrivateRadio().check();
    } else {
      this.clusterPrivacyPublicRadio().check();
    }
  }

  selectUpdateStratergy(stratergy) {
    if (stratergy == 'Recurring updates') {
      this.recurringUpdateRadio().check();
    } else {
      this.individualUpdateRadio().check();
    }
  }

  selectAvailabilityZone(az) {
    if (az == 'Single zone') {
      this.singleZoneAvilabilityRadio().check();
    } else {
      this.multiZoneAvilabilityRadio().check();
    }
  }

  selectRoleProviderMode(mode) {
    if (mode == 'Auto') {
      this.createModeAutoRadio().check();
    } else {
      this.createModeManualRadio().check();
    }
  }

  useCIDRDefaultValues(value = true) {
    if (value) {
      this.cidrDefaultValuesCheckBox().check();
    } else {
      this.cidrDefaultValuesCheckBox().uncheck();
    }
  }

  selectOIDCConfigID(configID) {
    cy.get('span').contains('Select a config id').click({ force: true });
    cy.get('ul[name="byo_oidc_config_id"]').find('span').contains(configID).click();
  }

  isClusterPropertyMatchesValue(property, value) {
    cy.get('span.pf-v5-c-description-list__text')
      .contains(property)
      .parent()
      .siblings()
      .find('div')
      .contains(value);
  }

  setMinimumNodeCount(nodeCount) {
    this.minimumNodeInput().type('{selectAll}').type(nodeCount);
  }
  setMaximumNodeCount(nodeCount) {
    this.maximumNodeInput().type('{selectAll}').type(nodeCount);
  }

  waitForClusterId() {
    // Wait 5 min for cluster id to populate on install page
    cy.getByTestId('clusterID', { timeout: 300000 }).should('not.contain', 'N/A');
  }

  waitForClusterReady() {
    // Wait up to 1 hour for cluster to be Ready
    cy.get('.pf-v5-u-ml-xs', { timeout: 3600000 }).should('contain', 'Ready');
  }

  waitForButtonContainingTextToBeEnabled(text, timeout = 30000) {
    cy.get(`button:contains('${text}')`, { timeout: timeout })
      .scrollIntoView()
      .should('be.enabled');
  }

  clickButtonContainingText(text, options = {}) {
    if (Object.keys(options).length == 0 && options.constructor === Object) {
      cy.get(`button:contains('${text}')`)
        .scrollIntoView()
        .should('be.visible')
        .should('be.enabled')
        .click();
    } else {
      cy.get(`button:contains('${text}')`).should('be.enabled').should('be.visible').click(options);
    }
  }

  waitForSpinnerToNotExist() {
    cy.get('.spinner-loading-text').should('not.exist');
  }

  clickCreateClusterBtn() {
    cy.getByTestId('create_cluster_btn').click();
  }

  isRosaCreateClusterDropDownVisible() {
    cy.get('#rosa-create-cluster-dropdown').scrollIntoView().should('be.visible');
  }

  clickRosaCreateClusterDropDownVisible() {
    cy.get('#rosa-create-cluster-dropdown').click();
  }

  isRosaCreateWithWebUIVisible() {
    cy.get('#with-web').should('be.visible');
  }

  clickRosaCreateWithWebUI() {
    cy.get('#with-web').click();
  }

  selectAvailabilityZoneRegion(avilabilityZoneRegion) {
    cy.get(".pf-v5-c-select__menu:contains('Select availability zone')").within(() => {
      cy.get('li').contains(avilabilityZoneRegion).click();
    });
  }

  inputPrivateSubnetId(subnetId) {
    cy.get('#private_subnet_id_0').type(subnetId);
  }

  enableCustomerManageKeys() {
    cy.get('#customer_managed_key-true').check().should('be.enabled');
  }

  inputCustomerManageKeyARN(kmsCustomKeyARN) {
    cy.get('#kms_key_arn').type(kmsCustomKeyARN).should('have.value', kmsCustomKeyARN);
  }

  enableEtcEncryption() {
    cy.get('#etcd_encryption').check().should('be.enabled');
  }

  isEtcEncryptionDisabled() {
    cy.get('#etcd_encryption').should('be.disabled');
  }

  enableFips() {
    cy.get('#fips').check().should('be.enabled');
  }

  isFipsDisabled() {
    cy.get('#fips').should('be.disabled');
  }

  inputRootDiskSize(rootDiskSize) {
    cy.get('[name="worker_volume_size_gib"]').clear().type(`{rightArrow}${rootDiskSize}`);
    cy.get('body').click();
    cy.get('[name="worker_volume_size_gib"]').should('have.value', rootDiskSize);
  }

  enableIMDSOnly() {
    cy.getByTestId('imds-required').then(($elem) => {
      if (!$elem.prop('checked')) {
        cy.getByTestId('imds-required').check();
      }
    });
  }

  imdsOptionalIsEnabled() {
    cy.getByTestId('imds-optional').then(($elem) => {
      if (!$elem.prop('checked')) {
        cy.getByTestId('imds-optional').check();
      }
    });
  }

  hideClusterNameValidation() {
    // Validation popup on cluster name field create flaky situation on below version field.
    // To remove the validation popup a click action in cluster left tree required.
    this.clusterDetailsTree().click();
  }

  inputNodeLabelKvs(nodeLabelKvs) {
    cy.wrap(nodeLabelKvs).each((kv, index) => {
      const key = Object.keys(kv)[0];
      const value = kv[key];
      cy.get(`[name="node_labels[${index}].key"]`).type(key);
      cy.get(`[name="node_labels[${index}].value"]`).type(value);
      if (index < nodeLabelKvs.length - 1) {
        CreateRosaWizardPage.clickButtonContainingText('Add additional label');
      }
    });
  }

  enableClusterPrivacyPublic() {
    cy.getByTestId('cluster_privacy-external').then(($elem) => {
      if (!$elem.prop('checked')) {
        cy.getByTestId('cluster_privacy-external').check();
      }
    });
  }

  enableClusterPrivacyPrivate() {
    cy.getByTestId('cluster_privacy-internal').then(($elem) => {
      if (!$elem.prop('checked')) {
        cy.getByTestId('cluster_privacy-internal').check();
      }
    });
  }

  clusterPrivacyIsDisabled() {
    cy.get('#cluster_privacy-internal').should('be.disabled');
  }

  enableInstallIntoExistingVpc() {
    cy.get('#install_to_vpc').check().should('be.enabled');
  }

  enableConfigureClusterWideProxy() {
    cy.get('#configure_proxy').check().should('be.enabled');
  }

  enableUpgradePolicyManual() {
    cy.getByTestId('upgrade_policy-manual').then(($elem) => {
      if (!$elem.prop('checked')) {
        cy.getByTestId('upgrade_policy-manual').check();
      }
    });
  }
  enableUpgradePolicyAutomatic() {
    cy.getByTestId('upgrade_policy-automatic').then(($elem) => {
      if (!$elem.prop('checked')) {
        cy.getByTestId('upgrade_policy-automatic').check();
      }
    });
  }

  enableRosaRolesProviderCreationModeManual() {
    cy.getByTestId('rosa_roles_provider_creation_mode-manual').then(($elem) => {
      if (!$elem.prop('checked')) {
        cy.getByTestId('rosa_roles_provider_creation_mode-manual').check();
      }
    });
  }
  enableRosaRolesProviderCreationModeAuto() {
    cy.getByTestId('rosa_roles_provider_creation_mode-auto').then(($elem) => {
      if (!$elem.prop('checked')) {
        cy.getByTestId('rosa_roles_provider_creation_mode-auto').check();
      }
    });
  }

  validateItemsInList(listOfMatchValues, listSelector) {
    cy.wrap(listOfMatchValues).each((value, index) => {
      cy.get(listSelector).eq(index).should('contain', value);
    });
  }

  clickBody() {
    cy.get('body').click();
  }

  validateElementsWithinShouldMethodValue(withinSelector, elementsWithin) {
    cy.get(withinSelector).within(() => {
      cy.wrap(elementsWithin).each((elementData) => {
        if (!elementData.value) {
          cy.get(elementData.element).should(elementData.method);
        } else {
          cy.get(elementData.element).should(elementData.method, elementData.value);
        }
      });
    });
  }
}

export default new CreateRosaCluster();
