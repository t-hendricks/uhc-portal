import Login from '../../pageobjects/login.page';
import ClusterListPage from '../../pageobjects/ClusterList.page';
import CreateRosaWizardPage from '../../pageobjects/CreateRosaWizard.page';
import ClusterDetailsPage from '../../pageobjects/ClusterDetails.page';
import * as path from 'path';

Cypress.config({
  defaultCommandTimeout: 180000,
  pageLoadTimeout: 120000,
  viewportWidth: 1600,
  viewportHeight: 1080,
});

Cypress.env(
  'installerARN',
  `arn:${Cypress.env('QE_AWS_ARN_PREFIX')}:iam::${Cypress.env('QE_AWS_ID')}:role/${Cypress.env(
    'ROLE_PREFIX',
  )}-${Cypress.env('QE_ENV_PREFIX')}-Installer-Role`,
);
Cypress.env(
  'clusterName',
  `${Cypress.env('QE_CLUSTER_NAME_PREFIX')}-${Math.random().toString(36).substring(2, 4)}`,
);
Cypress.env(
  'validationsResultFile',
  path.join(Cypress.config('downloadsFolder'), 'validations-deployment-result'),
);

export const workflowValidationTestTitles = [
  'Post Install: Tabs Validations',
  'Post Install: Overview Validations',
  'Post Install: Access Control Validations',
  'Post Installation: Add-ons Validations',
  'Post Installation: Cluster history Validations',
  'Post Installation: Networking Validations',
  'Post Installation: Machine pools Validations',
  'Post Installation: Support Validations',
  'Post Installation: Settings Validations',
  'Post Installation: Cluster List Validations',
];

describe('Create ROSA Cluster in FedRamp (OCP-TBD)', { tags: ['fedramp'] }, () => {
  after(() => {
    if (Cypress.env('TEARDOWN')) {
      cy.contains('a', Cypress.env('clusterName')).click();
      ClusterDetailsPage.actionsDropdownToggle().click();
      ClusterDetailsPage.deleteClusterDropdownItem().click();
      ClusterDetailsPage.deleteClusterNameInput().clear().type(Cypress.env('clusterName'));
      ClusterDetailsPage.deleteClusterConfirm().click();
      ClusterDetailsPage.waitForDeleteClusterActionComplete();
    }
  });

  afterEach(function () {
    if (this.currentTest.state === 'failed') {
      if (workflowValidationTestTitles.includes(this.currentTest.title)) {
        cy.log(
          `Writing file - ${Cypress.env('validationsResultFile')} with Contents - ${
            this.currentTest.state
          } - ${this.currentTest.title}`,
        );
        cy.writeFile(
          Cypress.env('validationsResultFile'),
          `${this.currentTest.state}: ${this.currentTest.title}\n`,
          { flag: 'a+' },
        );
        return false;
      }
    }
  });

  describe('Launch ROSA Wizard ,Select default values,Create cluster', () => {
    it('Open Rosa cluster wizard', () => {
      CreateRosaWizardPage.clickCreateClusterBtn();
      CreateRosaWizardPage.isRosaCreateClusterDropDownVisible();
      CreateRosaWizardPage.clickRosaCreateClusterDropDownVisible();
      CreateRosaWizardPage.isRosaCreateWithWebUIVisible();
      CreateRosaWizardPage.clickRosaCreateWithWebUI();
      CreateRosaWizardPage.isCreateRosaPage();
      CreateRosaWizardPage.waitForSpinnerToNotExist();
    });

    it('Step - Accounts and roles - Select Account roles, ARN definitions', () => {
      if (!Cypress.env('GOV_CLOUD')) {
        CreateRosaWizardPage.isControlPlaneTypeScreen();
        CreateRosaWizardPage.selectStandaloneControlPlaneTypeOption();
        cy.get(CreateRosaWizardPage.primaryButton).click({ force: true });
      }
      CreateRosaWizardPage.isAccountsAndRolesScreen();
      CreateRosaWizardPage.selectAWSInfrastructureAccount(Cypress.env('QE_AWS_ID'));
      CreateRosaWizardPage.refreshInfrastructureAWSAccountButton().click();
      CreateRosaWizardPage.waitForARNList();
      // duplicated steps because installer ARNs are not populated as per account selection for the first time.
      CreateRosaWizardPage.refreshInfrastructureAWSAccountButton().click();
      CreateRosaWizardPage.waitForARNList();
      CreateRosaWizardPage.selectInstallerRole(Cypress.env('installerARN'));
      CreateRosaWizardPage.clickButtonContainingText('Next');
    });

    it('Step - Cluster Settings - Select Cluster name, version, regions', () => {
      CreateRosaWizardPage.isClusterDetailsScreen();
      cy.get(CreateRosaWizardPage.clusterNameInput).type(Cypress.env('clusterName'));
      CreateRosaWizardPage.clusterDetailsTree().click();
      CreateRosaWizardPage.selectClusterVersion(Cypress.env('CLUSTER_VERSION'));
      CreateRosaWizardPage.selectRegion(Cypress.env('QE_AWS_REGION_AND_LOCATION'));
      CreateRosaWizardPage.clickButtonContainingText('Advanced Encryption');
      if (Cypress.env('ENCRYPT_VOLUMES_WITH_CUSTOMER_KEYS') == 'Enabled') {
        CreateRosaWizardPage.enableCustomerManageKeys();
        CreateRosaWizardPage.inputCustomerManageKeyARN(Cypress.env('KMS_CUSTOM_KEY_ARN'));
      }
      if (!Cypress.env('GOV_CLOUD') && Cypress.env('ADDITIONAL_ETCD_ENCRYPTION') == 'Enabled') {
        CreateRosaWizardPage.enableEtcEncryption();
      } else {
        CreateRosaWizardPage.isEtcEncryptionDisabled();
      }
      if (!Cypress.env('GOV_CLOUD') && Cypress.env('FIPS_CRYPTOGRAPHY') == 'Enabled') {
        CreateRosaWizardPage.enableFips();
      } else {
        CreateRosaWizardPage.isFipsDisabled();
      }
      CreateRosaWizardPage.clickButtonContainingText('Next');
    });

    it('Step - Cluster Settings - Select machine pool node type and node count', () => {
      CreateRosaWizardPage.isClusterMachinepoolsScreen();
      CreateRosaWizardPage.selectComputeNodeType(Cypress.env('COMPUTE_NODE_TYPE'));
      if (Cypress.env('AUTO_SCALING') == 'Enabled') {
        CreateRosaWizardPage.enableAutoScaling();
        CreateRosaWizardPage.inputMinNodeCount(Cypress.env('MIN_NODE_COUNT'));
        CreateRosaWizardPage.inputMaxNodeCount(Cypress.env('MAX_NODE_COUNT'));
      } else {
        CreateRosaWizardPage.selectComputeNodeCount(Cypress.env('COMPUTE_NODE_COUNT'));
      }
      CreateRosaWizardPage.inputRootDiskSize(Cypress.env('ROOT_DISK_SIZE'));
      if (Cypress.env('INSTANCE_METADATA_SERVICE') == 'IMDSv2 only') {
        CreateRosaWizardPage.enableIMDSOnly();
      } else {
        CreateRosaWizardPage.imdsOptionalIsEnabled();
      }
      if (Cypress.env('ADD_NODE_LABELS')) {
        CreateRosaWizardPage.clickButtonContainingText('Add node labels');
        if (Cypress.env('NODE_LABEL_KVS')) {
          CreateRosaWizardPage.inputNodeLabelKvs(Cypress.env('NODE_LABEL_KVS'));
        }
      }
      CreateRosaWizardPage.clickButtonContainingText('Next');
    });

    it('Step - Cluster Settings - configuration - Select cluster privacy', () => {
      if (Cypress.env('GOV_CLOUD')) {
        CreateRosaWizardPage.clusterPrivacyIsDisabled();
        CreateRosaWizardPage.clickButtonContainingText('Next');
        CreateRosaWizardPage.clickButtonContainingText('Select a VPC');
        CreateRosaWizardPage.clickButtonContainingText(Cypress.env('VPC_NAME'));
        CreateRosaWizardPage.clickButtonContainingText('Select availability zone');
        CreateRosaWizardPage.selectAvailabilityZoneRegion(Cypress.env('AVAILABILITY_ZONE_REGION'));
        CreateRosaWizardPage.inputPrivateSubnetId(Cypress.env('SUBNET_ID'));
        if (Cypress.env('INSTALL_INTO_AWS_SHARED_VPC')) {
          cy.get('#shared_vpc\\.is_selected').check().should('be.enabled');
          if (Cypress.env('SHARED_VPC_BASE_DNS_DOMAIN') == 'auto') {
            // TODO: Add steps to configure the aws hosted zone
            CreateRosaWizardPage.clickButtonContainingText('Select base DNS domain');
            CreateRosaWizardPage.clickButtonContainingText('Reserve new base DNS domain');
          } else {
            // TODO: Add steps to use a pre-configured shared vpc
            cy.get('sharedvpcdropdown')
              .type(Cypress.env('SHARED_VPC_BASE_DNS_DOMAIN'))
              .should('have.value', Cypress.env('SHARED_VPC_BASE_DNS_DOMAIN'));
          }
        }
        CreateRosaWizardPage.clickButtonContainingText('Next');
      } else {
        if (Cypress.env('CLUSTER_PRIVACY') == 'private') {
          CreateRosaWizardPage.enableClusterPrivacyPrivate();
          CreateRosaWizardPage.clickButtonContainingText('Next');
          CreateRosaWizardPage.clickButtonContainingText('Select a VPC');
          CreateRosaWizardPage.clickButtonContainingText(Cypress.env('VPC_NAME'));
          CreateRosaWizardPage.clickButtonContainingText('Select availability zone');
          CreateRosaWizardPage.selectAvailabilityZoneRegion(
            Cypress.env('AVAILABILITY_ZONE_REGION'),
          );
          CreateRosaWizardPage.inputPrivateSubnetId(Cypress.env('SUBNET_ID'));
          CreateRosaWizardPage.clickButtonContainingText('Next');
        }
        if (Cypress.env('CLUSTER_PRIVACY') == 'public') {
          CreateRosaWizardPage.enableClusterPrivacyPublic();
          if (Cypress.env('INSTALL_INTO_EXISTING_VPC') == 'Enabled') {
            CreateRosaWizardPage.enableInstallIntoExistingVpc();
          }
          if (Cypress.env('CONFIGURE_CLUSTER_WIDE_PROXY') == 'Enabled') {
            CreateRosaWizardPage.enableConfigureClusterWideProxy();
          }
        }
        CreateRosaWizardPage.clickButtonContainingText('Next');
      }
    });

    it('Step - Cluster Settings - CIDR Ranges - CIDR default values', () => {
      // TODO: create logic to allow for non-default values
      if (Cypress.env('USE_NON_DEFAULT_CIDR')) {
        CreateRosaWizardPage.useCIDRDefaultValues(false);
        CreateRosaWizardPage.machineCIDRInput()
          .clear()
          .type(Cypress.env('MACHINE_CIDR'))
          .should('have.value', Cypress.env('MACHINE_CIDR'));
        CreateRosaWizardPage.serviceCIDRInput()
          .clear()
          .type(Cypress.env('SERVICE_CIDR'))
          .should('have.value', Cypress.env('SERVICE_CIDR'));
        CreateRosaWizardPage.podCIDRInput()
          .clear()
          .type(Cypress.env('POD_CIDR'))
          .should('have.value', Cypress.env('POD_CIDR'));
        CreateRosaWizardPage.hostPrefixInput()
          .clear()
          .type(Cypress.env('HOST_PREFIX'))
          .should('have.value', Cypress.env('HOST_PREFIX'));
      } else {
        CreateRosaWizardPage.useCIDRDefaultValues(false);
        CreateRosaWizardPage.useCIDRDefaultValues(true);
      }
      CreateRosaWizardPage.machineCIDRInput().should('have.value', Cypress.env('MACHINE_CIDR'));
      CreateRosaWizardPage.serviceCIDRInput().should('have.value', Cypress.env('SERVICE_CIDR'));
      CreateRosaWizardPage.podCIDRInput().should('have.value', Cypress.env('POD_CIDR'));
      CreateRosaWizardPage.hostPrefixInput().should('have.value', Cypress.env('HOST_PREFIX'));
      CreateRosaWizardPage.clickButtonContainingText('Next');
    });

    it('Step - Cluster roles and policies - role provider mode and its definitions', () => {
      if (Cypress.env('ROLE_PROVIDER_MODE') == 'Manual') {
        CreateRosaWizardPage.enableRosaRolesProviderCreationModeManual();
      }
      if (Cypress.env('ROLE_PROVIDER_MODE') == 'Auto') {
        CreateRosaWizardPage.enableRosaRolesProviderCreationModeAuto();
      }
      CreateRosaWizardPage.customOperatorPrefixInput().should('be.visible');
      CreateRosaWizardPage.customOperatorPrefixInput().invoke('val').should('not.be.empty');
      CreateRosaWizardPage.clickButtonContainingText('Next');
    });

    it('Step - Cluster update - update strategies and its definitions', () => {
      if (Cypress.env('UPDATE_STRATEGY') == 'Individual updates') {
        CreateRosaWizardPage.enableUpgradePolicyManual();
      }
      if (Cypress.env('UPDATE_STRATEGY') == 'Recurring updates') {
        CreateRosaWizardPage.enableUpgradePolicyAutomatic();
      }
      CreateRosaWizardPage.clickButtonContainingText('Next');
    });

    it('Step - Review and create : Accounts and roles definitions', () => {
      CreateRosaWizardPage.isClusterPropertyMatchesValue(
        'AWS infrastructure account ID',
        Cypress.env('QE_AWS_ID'),
      );
      CreateRosaWizardPage.isClusterPropertyMatchesValue(
        'Installer role',
        Cypress.env('installerARN'),
      );
    });

    it('Step - Review and create : Cluster Settings definitions', () => {
      CreateRosaWizardPage.isClusterPropertyMatchesValue(
        'Cluster name',
        Cypress.env('clusterName'),
      );
      CreateRosaWizardPage.isClusterPropertyMatchesValue('Version', Cypress.env('CLUSTER_VERSION'));
      CreateRosaWizardPage.isClusterPropertyMatchesValue('Region', Cypress.env('QE_AWS_REGION'));
      CreateRosaWizardPage.isClusterPropertyMatchesValue(
        'Availability',
        Cypress.env('CLUSTER_AVAILABILITY'),
      );
      CreateRosaWizardPage.isClusterPropertyMatchesValue(
        'Encrypt volumes with customer keys',
        Cypress.env('ENCRYPT_VOLUMES_WITH_CUSTOMER_KEYS'),
      );
      CreateRosaWizardPage.isClusterPropertyMatchesValue(
        'Additional etcd encryption',
        Cypress.env('ADDITIONAL_ETCD_ENCRYPTION'),
      );
      CreateRosaWizardPage.isClusterPropertyMatchesValue(
        'FIPS cryptography',
        Cypress.env('FIPS_CRYPTOGRAPHY'),
      );
    });

    it('Step - Review and create : Machine pool definitions', () => {
      CreateRosaWizardPage.isClusterPropertyMatchesValue(
        'Node instance type',
        Cypress.env('COMPUTE_NODE_TYPE'),
      );
      CreateRosaWizardPage.isClusterPropertyMatchesValue(
        'Autoscaling',
        Cypress.env('AUTO_SCALING'),
      );
      CreateRosaWizardPage.isClusterPropertyMatchesValue(
        'Compute node count',
        Cypress.env('COMPUTE_NODE_COUNT'),
      );
      CreateRosaWizardPage.isClusterPropertyMatchesValue(
        'Install into existing VPC',
        Cypress.env('INSTALL_INTO_EXISTING_VPC'),
      );
      CreateRosaWizardPage.isClusterPropertyMatchesValue(
        'Instance Metadata Service (IMDS)',
        Cypress.env('INSTANCE_METADATA_SERVICE'),
      );
    });

    it('Step - Review and create : Networking definitions', () => {
      CreateRosaWizardPage.isClusterPropertyMatchesValue(
        'Cluster privacy',
        Cypress.env('CLUSTER_PRIVACY_VALIDATION'),
      );
      CreateRosaWizardPage.isClusterPropertyMatchesValue(
        'Machine CIDR',
        Cypress.env('MACHINE_CIDR'),
      );
      CreateRosaWizardPage.isClusterPropertyMatchesValue(
        'Service CIDR',
        Cypress.env('SERVICE_CIDR'),
      );
      CreateRosaWizardPage.isClusterPropertyMatchesValue('Pod CIDR', Cypress.env('POD_CIDR'));
      CreateRosaWizardPage.isClusterPropertyMatchesValue('Host prefix', Cypress.env('HOST_PREFIX'));
    });

    it('Step - Review and create : cluster roles and update definitions', () => {
      CreateRosaWizardPage.isClusterPropertyMatchesValue(
        'Operator roles and OIDC provider mode',
        Cypress.env('ROLE_PROVIDER_MODE_VALIDATION'),
      );
      CreateRosaWizardPage.isClusterPropertyMatchesValue(
        'Update strategy',
        Cypress.env('UPDATE_STRATEGY'),
      );
    });

    it('Create cluster and check the installation progress', () => {
      CreateRosaWizardPage.createClusterButton().click();
      ClusterDetailsPage.waitForInstallerScreenToLoad();
      ClusterDetailsPage.clusterNameTitle().contains(Cypress.env('clusterName'));
      cy.get('h2').contains('Installing cluster').should('be.visible');
      cy.get('a').contains('Download OC CLI').should('be.visible');
      ClusterDetailsPage.clusterDetailsPageRefresh();
      ClusterDetailsPage.checkInstallationStepStatus('Account setup');
      ClusterDetailsPage.checkInstallationStepStatus('OIDC and operator roles');
      ClusterDetailsPage.checkInstallationStepStatus('DNS setup');
      ClusterDetailsPage.checkInstallationStepStatus('Cluster installation');
      ClusterDetailsPage.clusterTypeLabelValue().contains('ROSA');
      ClusterDetailsPage.clusterRegionLabelValue().contains(Cypress.env('QE_AWS_REGION'));
      ClusterDetailsPage.clusterAvailabilityLabelValue().contains(
        Cypress.env('CLUSTER_AVAILABILITY'),
      );
      ClusterDetailsPage.clusterInfrastructureAWSaccountLabelValue().contains(
        Cypress.env('QE_AWS_ID'),
      );
      ClusterDetailsPage.clusterMachineCIDRLabelValue(Cypress.env('MACHINE_CIDR'));
      ClusterDetailsPage.clusterServiceCIDRLabelValue(Cypress.env('SERVICE_CIDR'));
      ClusterDetailsPage.clusterPodCIDRLabelValue(Cypress.env('POD_CIDR'));
      ClusterDetailsPage.clusterHostPrefixLabelValue(Cypress.env('HOST_PREFIX'));
    });
    it('Waits for install to finish', () => {
      // Wait for cluster installation to finish
      CreateRosaWizardPage.waitForClusterId();
      CreateRosaWizardPage.waitForClusterReady();
    });
    it('Post Install: Tabs Validations', () => {
      if (Cypress.env('GOV_CLOUD')) {
        const tabsListGovCloud = [
          'Overview',
          'Access control',
          'Cluster history',
          'Networking',
          'Machine pools',
          'Support',
          'Settings',
        ];
        CreateRosaWizardPage.validateItemsInList(tabsListGovCloud, '.pf-v5-c-tabs__list > li');
      } else {
        const tabsListCommercial = [
          'Overview',
          'Access control',
          'Add-ons',
          'Cluster history',
          'Networking',
          'Machine pools',
          'Support',
          'Settings',
        ];
        CreateRosaWizardPage.validateItemsInList(tabsListCommercial, '.pf-v5-c-tabs__list > li');
      }
    });
    it('Post Install: Overview Validations', () => {
      cy.getByTestId('clusterType').scrollIntoView().should('contain', 'ROSA');
      cy.getByTestId('region').scrollIntoView().should('contain', Cypress.env('QE_AWS_REGION'));
      cy.getByTestId('availability')
        .scrollIntoView()
        .should('contain', Cypress.env('CLUSTER_AVAILABILITY'));
      if (Cypress.env('GOV_CLOUD')) {
        cy.getByTestId('resource-usage').should('not.exist');
        // BUG: These elements are missing data-testids
        cy.get('.pf-v5-c-description-list__text').contains('Total vCPU').should('not.exist');
        cy.get('.pf-v5-c-description-list__text').contains('Total memory').should('not.exist');
      } else {
        cy.getByTestId('resource-usage').should('exist');
        // BUG: These elements are missing data-testids
        cy.get('.pf-v5-c-description-list__text').contains('Total vCPU').should('exist');
        cy.get('.pf-v5-c-description-list__text').contains('Total memory').should('exist');
      }
      // BUG: This element is missing data-testids
      // cy.getByTestId('version')
      if (Cypress.env('FIPS_CRYPTOGRAPHY') == 'Enabled') {
        cy.getByTestId('fipsCryptographyStatus')
          .scrollIntoView()
          .should('contain', Cypress.env('FIPS_CRYPTOGRAPHY_VALIDATION'));
      }
      cy.getByTestId('infrastructureAWSAccount')
        .scrollIntoView()
        .should('contain', Cypress.env('QE_AWS_ID'));
      cy.getByTestId('etcEncryptionStatus')
        .scrollIntoView()
        .should('contain', Cypress.env('ADDITIONAL_ETCD_ENCRYPTION'));
      if (Cypress.env('GOV_CLOUD')) {
        cy.getByTestId('controlPlaneNodesCountContainer').should('not.exist');
        cy.getByTestId('controlPlaneNodesCount').should('not.exist');
        cy.getByTestId('InfraNodesCountContainer').should('not.exist');
        cy.getByTestId('infraNodesCount').should('not.exist');
        // BUG: Missing container data-testid for computeNodesCountContainer
        // cy.getByTestId('')
        cy.getByTestId('computeNodeCount').should('not.exist');
      } else {
        cy.getByTestId('controlPlaneNodesCountContainer').scrollIntoView().should('exist');
        cy.getByTestId('controlPlaneNodesCount').scrollIntoView().should('exist');
        cy.getByTestId('InfraNodesCountContainer').scrollIntoView().should('exist');
        cy.getByTestId('infraNodesCount').scrollIntoView().should('exist');
        // BUG: Missing container data-testid for computeNodesCountContainer
        // cy.getByTestId('')
        cy.getByTestId('computeNodeCount').scrollIntoView().should('exist');
      }
      cy.getByTestId('clusterAutoscalingStatus')
        .scrollIntoView()
        .should('contain', Cypress.env('AUTO_SCALING'));
      cy.getByTestId('instanceMetadataService')
        .scrollIntoView()
        .should('contain', Cypress.env('INSTANCE_METADATA_SERVICE'));
      cy.getByTestId('machineCIDR').scrollIntoView().should('contain', Cypress.env('MACHINE_CIDR'));
      cy.getByTestId('serviceCIDR').scrollIntoView().should('contain', Cypress.env('SERVICE_CIDR'));
      cy.getByTestId('podCIDR').scrollIntoView().should('contain', Cypress.env('POD_CIDR'));
      cy.getByTestId('hostPrefix')
        .scrollIntoView()
        .should('contain', Cypress.env('HOST_PREFIX').substring(1));
    });
    it('Post Install: Access Control Validations', () => {
      CreateRosaWizardPage.clickButtonContainingText('Access control');
      // Identity providers
      cy.get('.pf-v5-c-tabs__item-text').contains('Identity providers').should('exist');
      CreateRosaWizardPage.clickButtonContainingText('Identity providers');
      cy.get('#add-identity-provider').should('be.visible').click();
      const providers = ['GitHub', 'Google', 'OpenID', 'LDAP', 'GitLab', 'htpasswd'];
      CreateRosaWizardPage.validateItemsInList(providers, '.pf-v5-c-dropdown__menu > li');
      // Section: Cluster Roles and Access
      cy.get('.pf-v5-c-tabs__item-text').contains('Cluster Roles and Access').should('exist');
      CreateRosaWizardPage.clickButtonContainingText('Cluster Roles and Access');
      CreateRosaWizardPage.clickButtonContainingText('Add user');
      cy.get('[aria-label="Add cluster user"]').should('be.visible');
      cy.get('#user-id').should('exist');
      cy.get('#dedicated-admins').should('exist');
      cy.get('#cluster-admins').should('exist');
      // TODO: Investigate why multiple true and force are needed
      CreateRosaWizardPage.clickButtonContainingText('Cancel', { force: true, multiple: true });
      cy.get('[aria-label="Add cluster user"]').should('not.exist');
      // Section: OCM Roles and Access
      cy.get('.pf-v5-c-tabs__item-text').contains('OCM Roles and Access').should('exist');
      CreateRosaWizardPage.clickButtonContainingText('OCM Roles and Access');
      CreateRosaWizardPage.clickButtonContainingText('Grant role');
      cy.get('[aria-label="Grant role"]').should('be.visible');
      cy.get('#username').should('exist');
      CreateRosaWizardPage.clickButtonContainingText('Cluster editor');
      const roles = [
        'Cluster editor',
        'Cluster viewer',
        'Cluster autoscaler editor',
        'Identity provider editor',
        'Machine pool editor',
      ];
      CreateRosaWizardPage.validateItemsInList(roles, '.pf-v5-c-select__menu > li');
      CreateRosaWizardPage.clickBody();
      cy.get('[type="submit"]').contains('Grant role').should('be.visible');
      // TODO: Investigate why force and multiple true are needed
      CreateRosaWizardPage.clickButtonContainingText('Cancel', { force: true, multiple: true });
      cy.get('[aria-label="Grant role"]').should('not.exist');
    });
    it('Post Installation: Add-ons Validations', () => {
      if (Cypress.env('GOV_CLOUD')) {
        cy.get('.pf-v5-c-tabs__item-text').contains('Add-ons').should('not.exist');
      } else {
        cy.get('.pf-v5-c-tabs__item-text').contains('Add-ons').should('exist');
      }
    });
    it('Post Installation: Cluster history Validations', () => {
      cy.get('.pf-v5-c-tabs__item-text').contains('Cluster history').should('exist');
      CreateRosaWizardPage.clickButtonContainingText('Cluster history');
      CreateRosaWizardPage.clickButtonContainingText('Last month', { force: true, multiple: true });
      const timeOptions = ['Last month', 'Last week', 'Last 72 hours', 'Custom'];
      CreateRosaWizardPage.validateItemsInList(timeOptions, '.pf-v5-c-select__menu > li');
      CreateRosaWizardPage.clickBody();
      cy.get('[aria-label="Conditional filter"]').click();
      const filterOptions = ['Description', 'Severity', 'Type', 'Logged by'];
      CreateRosaWizardPage.validateItemsInList(filterOptions, '.pf-v5-c-menu__list > li');
      CreateRosaWizardPage.clickBody();
      cy.getByTestId('download-btn').should('exist').should('contain', 'Download history');
      // BUG: Cluster history log lines do not populate for GOV_CLOUD env
    });
    it('Post Installation: Networking Validations', () => {
      cy.get('.pf-v5-c-tabs__item-text').contains('Networking').should('exist');
      CreateRosaWizardPage.clickButtonContainingText('Networking');
      // TODO: Validate actual values
      cy.get(
        '#networkingTabContent > .pf-v5-l-grid > :nth-child(1) > .pf-v5-c-card > .pf-v5-c-card__body',
      ).within(() => {
        if (Cypress.env('CLUSTER_PRIVACY') == 'private') {
          cy.get('.pf-v5-c-content').should('contain', 'Private API');
        } else {
          cy.get('.pf-v5-c-content').should('contain', 'Public API');
        }
      });
      cy.get(
        '#networkingTabContent > .pf-v5-l-grid > :nth-child(3) > .pf-v5-c-card > .pf-v5-c-card__body',
      ).within(() => {
        if (Cypress.env('GOV_CLOUD')) {
          // TODO: Check if there is a way to make this more specific
          cy.get('#default_router_address').should('exist');
        } else {
          cy.get('#default_router_address').should('exist');
        }
        if (Cypress.env('CLUSTER_PRIVACY') == 'private') {
          cy.get('.pf-v5-c-content').should('contain', 'Private router');
        } else {
          cy.get('.pf-v5-c-content').should('contain', 'Public router');
        }
        cy.get('#defaultRouterSelectors').should('exist');
        cy.get('#defaultRouterExcludedNamespacesFlag').should('exist');
        cy.get('#clusterRoutesTlsSecretRef').should('exist');
        cy.get('#clusterRoutesHostname').should('exist');
        cy.get(':nth-child(6) > .pf-v5-c-form__group-control')
          .contains('Inter-namespace ownership')
          .within(() => {
            cy.get('.pf-v5-c-switch__input').should('be.disabled');
          });
        cy.get(':nth-child(7) > .pf-v5-c-form__group-control')
          .contains('Disallowed')
          .within(() => {
            cy.get('.pf-v5-c-switch__input').should('be.disabled');
          });
        cy.get(':nth-child(8) > .pf-v5-c-form__group-control')
          .contains('Classic Load Balancer')
          .within(() => {
            cy.get('.pf-v5-c-switch__input').should('be.disabled');
          });
      });
      cy.get('.pf-v5-c-action-list > .pf-v5-c-button')
        .scrollIntoView()
        .contains('Edit application ingress');
      if (Cypress.env('CLUSTER_PRIVACY') == 'private') {
        const elementsWithinNetworkingTabCard5 = [
          { element: '.pf-v5-c-title', method: 'contain', value: 'VPC Details' },
          { element: '.pf-v5-c-description-list__text', method: 'contain', value: 'Enabled' },
          { element: '.pf-v5-c-title', method: 'contain', value: 'Cluster-wide Proxy' },
        ];
        CreateRosaWizardPage.validateElementsWithinShouldMethodValue(
          '.pf-v5-l-grid > :nth-child(5) > .pf-v5-c-card > .pf-v5-c-card__body',
          elementsWithinNetworkingTabCard5,
        );
      }
    });
    it('Post Installation: Machine pools Validations', () => {
      cy.get('.pf-v5-c-tabs__item-text').contains('Machine pools');
      CreateRosaWizardPage.clickButtonContainingText('Machine pools');
      cy.get('#add-machine-pool').should('be.visible').should('be.enabled');
      cy.get('#edit-existing-cluster-autoscaling').should('be.visible').should('be.enabled');
      cy.get('[data-label="Machine pool"]').contains('Machine pool');
      cy.get('[data-label="Instance type"]').contains('Instance type');
      cy.get('[data-label="Availability zones"]').contains('Availability zones');
      cy.get('[data-label="Node count"]').contains('Node count');
      cy.get('[data-label="Autoscaling"]').contains('Autoscaling');
      // BUG: Validate day1 machines pool row values. BLOCKER because above mentioned bug
    });
    it('Post Installation: Support Validations', () => {
      cy.get('.pf-v5-c-tabs__item-text').contains('Support');
      CreateRosaWizardPage.clickButtonContainingText('Support');
      CreateRosaWizardPage.clickButtonContainingText('Add notification contact');
      const elementsWithinAddNotificationContact = [
        {
          element: '.pf-v5-c-modal-box__title-text',
          method: 'contain',
          value: 'Add notification contact',
        },
        {
          element: '.pf-v5-u-mb-xl',
          method: 'contain',
          value:
            'Identify the user to be added as notification contact. These users will be contacted in the event of notifications about this cluster.',
        },
        {
          element: '.pf-v5-c-form__label-text',
          method: 'contain',
          value: 'Red Hat username or email',
        },
        { element: '#username', method: 'be.visible' },
      ];
      CreateRosaWizardPage.validateElementsWithinShouldMethodValue(
        '[aria-label="Add notification contact"]',
        elementsWithinAddNotificationContact,
      );
      CreateRosaWizardPage.clickButtonContainingText('Cancel', { force: true, multiple: true });
      cy.get('[aria-label="Add notification contact"]').should('not.exist');
      cy.getByTestId('support-case-btn')
        .should('be.visible')
        .should('contain', 'Open support case');
      if (Cypress.env('GOV_CLOUD')) {
        cy.getByTestId('support-case-btn').should(
          'have.attr',
          'href',
          'https://redhatgov.servicenowservices.com/css',
        );
      } else {
        cy.getByTestId('support-case-btn')
          .should('have.attr', 'href')
          .should(
            'include',
            'https://access.redhat.com/support/cases/#/case/new/open-case/describe-issue',
          );
      }
    });
    it('Post Installation: Settings Validations', () => {
      cy.get('.pf-v5-c-tabs__item-text').contains('Settings');
      CreateRosaWizardPage.clickButtonContainingText('Settings');
      const elementsWithinUpgradeMonitoringCard1 = [
        { element: '.pf-v5-c-title', method: 'contain', value: 'Monitoring' },
        { element: '#enable_user_workload_monitoring', method: 'be.checked' },
        {
          element: '.pf-v5-c-check__label',
          method: 'contain',
          value: 'Enable user workload monitoring',
        },
        {
          element: 'div',
          method: 'contain',
          value:
            'Monitor your own projects in isolation from Red Hat Site Reliability Engineering (SRE) platform metrics.',
        },
      ];
      CreateRosaWizardPage.validateElementsWithinShouldMethodValue(
        '.ocm-c-upgrade-monitoring > :nth-child(1) > .pf-v5-c-card > .pf-v5-c-card__body',
        elementsWithinUpgradeMonitoringCard1,
      );
      cy.get('.ocm-c-upgrade-monitoring > :nth-child(2) > .pf-v5-c-card').within(() => {
        cy.get('.pf-v5-c-card__title').should('contain', 'Update strategy');
        cy.get('.pf-v5-l-grid > :nth-child(1) > p').should(
          'contain',
          'Note: In the event of Critical security concerns (new window or tab) (CVEs) that significantly impact the security or stability of the cluster, updates may be automatically scheduled by Red Hat SRE to the latest z-stream version not impacted by the CVE within 2 business days after customer notifications.',
        );
        if (Cypress.env('UPDATE_STRATEGY') == 'Individual updates') {
          cy.getByTestId('upgrade_policy-manual').should('be.checked');
          cy.getByTestId('upgrade_policy-automatic').should('not.be.checked');
        } else {
          cy.getByTestId('upgrade_policy-manual').should('not.be.checked');
          cy.getByTestId('upgrade_policy-automatic').should('be.checked');
        }
        cy.get('.pf-v5-c-radio__description')
          .eq(0)
          .invoke('text')
          .should(
            'contain',
            'Schedule each update individually. Take into consideration end of life dates from the lifecycle policy (new window or tab) when planning updates.',
          );
        cy.get('.pf-v5-c-radio__description')
          .eq(1)
          .invoke('text')
          .should(
            'contain',
            "The cluster will be automatically updated based on your preferred day and start time when new patch updates (z-stream (new window or tab)) are available. When a new minor version is available, you'll be notified and must manually allow the cluster to update to the next minor version.",
          );
        cy.get('h4').should('contain', 'Node draining');
        cy.get('.pf-v5-c-content').should(
          'contain',
          'You may set a grace period for how long pod disruption budget-protected workloads will be respected during updates. After this grace period, any workloads protected by pod disruption budgets that have not been successfully drained from a node will be forcibly evicted.',
        );
        cy.get('.pf-v5-c-form__label').should('contain', 'Grace period');
        CreateRosaWizardPage.clickButtonContainingText('1 hour');
        const gracePeriodOptions = [
          '15 minutes',
          '30 minutes',
          '1 hour',
          '2 hours',
          '4 hours',
          '8 hours',
        ];
        CreateRosaWizardPage.validateItemsInList(gracePeriodOptions, '.pf-v5-c-select__menu > li');
      });
      cy.get('#clusterdetails-content').click();
      const elementsWithinUpgradeMonitoringCard3 = [
        { element: '.pf-v5-c-card__title', method: 'contain', value: 'Update status' },
        { element: '.pf-v5-c-button', method: 'contain', value: 'Update' },
      ];
      CreateRosaWizardPage.validateElementsWithinShouldMethodValue(
        '.ocm-c-upgrade-monitoring > :nth-child(3) > .pf-v5-c-card',
        elementsWithinUpgradeMonitoringCard3,
      );
    });
    it('Post Installation: Cluster List Validations', () => {
      cy.get('.pf-v5-c-breadcrumb__link').contains('Clusters').click();
      cy.get('#cluster-list-header').should('contain', 'Clusters');
      if (Cypress.env('GOV_CLOUD')) {
        const govCloudNavBarItems = ['Clusters', 'Releases', 'Downloads'];
        CreateRosaWizardPage.validateItemsInList(govCloudNavBarItems, '.pf-v5-c-nav__list > li');
        cy.getByTestId('filterInputClusterList').should('be.visible');
        cy.getByTestId('create_cluster_btn').should('be.visible');
        cy.get('#view-only-my-clusters').should('have.attr', 'aria-label', 'View only my clusters');
        cy.getByTestId('register-cluster-item').should('not.exist');
        cy.get('button:contains("Cluster type")').should('not.exist');
        // TODO: Check to see if we are going to be adding this to FedRamp
        // cy.get('.pf-v5-c-toolbar__item > a').should('have.attr', 'href', '/openshift/archived')
      } else {
        const commercialCloudNavBarItems = [
          'Clusters',
          'Overview',
          'Releases',
          'Developer Sandbox',
          'Downloads',
          'Advisor',
          'Recommendations',
          'Clusters',
          'Vulnerability',
          'CVEs',
          'Clusters',
          'Subscriptions',
          'Container Platform',
          'Dedicated (Annual)',
          'Dedicated (On-Demand)',
          'Dedicated (On-Demand Limits)',
          'RHEL Subscriptions',
          'Cost Management',
          'Overview',
          'OpenShift ',
          'Amazon Web Services',
          'Google Cloud Platform',
          'IBM Cloud',
          'Microsoft Azure',
          'Oracle Cloud Infrastructure',
          'Cost Models',
          'Cost Explorer',
          'Support Cases',
          'Cluster Manager Feedback',
          'Red Hat Marketplace',
          'Documentation',
        ];
        CreateRosaWizardPage.validateItemsInList(
          commercialCloudNavBarItems,
          '.pf-v5-c-nav__list > li',
        );
        cy.getByTestId('filterInputClusterList').should('be.visible');
        cy.getByTestId('create_cluster_btn').should('be.visible');
        cy.get('#view-only-my-clusters').should('have.attr', 'aria-label', 'View only my clusters');
        cy.getByTestId('register-cluster-item').should('exist');
        cy.get('.pf-v5-c-dropdown__toggle').contains('Cluster type').should('exist');
        cy.get('.pf-v5-c-toolbar__content-section > :nth-child(5) > a').should(
          'have.attr',
          'href',
          '/openshift/archived',
        );
      }
    });
  });
});
