import Login from '../../pageobjects/login.page';
import ClusterListPage from '../../pageobjects/ClusterList.page';
import CreateRosaWizardPage from '../../pageobjects/CreateRosaWizard.page';
import ClusterDetailsPage from '../../pageobjects/ClusterDetails.page';

// awsAccountID,rolePrefix and installerARN are set by prerun script for smoke requirements.
const awsAccountID = Cypress.env('QE_AWS_ID');
const rolePrefix = 'cypress-account-roles';
const installerARN = 'arn:aws:iam::' + awsAccountID + ':role/' + rolePrefix + '-Installer-Role';
const clusterName = `smkrosa-` + (Math.random() + 1).toString(36).substring(7);

describe(
  'Rosa cluster wizard advanced settings with cluster creation tests(OCP-36105)',
  { tags: ['smoke'] },
  () => {
    before(() => {
      cy.visit('/?fake=true');
      Login.isLoginPageUrl();
      Login.login();

      ClusterListPage.isClusterListUrl();
      ClusterListPage.waitForDataReady();
      cy.getByTestId('create_cluster_btn').should('be.visible');
    });

    describe('Launch ROSA Wizard with advanced settings, Create cluster', () => {
      it('Open Rosa cluster wizard with advanced settings', () => {
        cy.getByTestId('create_cluster_btn').click();
        CreateRosaWizardPage.rosaCreateClusterButton().click();
        CreateRosaWizardPage.rosaClusterWithWeb().should('be.visible').click();
        CreateRosaWizardPage.isCreateRosaPage();
        cy.get('.spinner-loading-text').should('not.exist');
      });

      it('Step - Control plane - Select control plane type', () => {
        CreateRosaWizardPage.isControlPlaneTypeScreen();
        CreateRosaWizardPage.selectStandaloneControlPlaneTypeOption();
        cy.get(CreateRosaWizardPage.primaryButton).click({ force: true });
      });

      it('Step - Accounts and roles - Select Account roles, ARN definitions', () => {
        CreateRosaWizardPage.isAccountsAndRolesScreen();
        CreateRosaWizardPage.selectAWSInfrastructureAccount(awsAccountID);
        CreateRosaWizardPage.refreshInfrastructureAWSAccountButton().click();
        CreateRosaWizardPage.waitForARNList();
        CreateRosaWizardPage.refreshInfrastructureAWSAccountButton().click();
        CreateRosaWizardPage.waitForARNList();
        CreateRosaWizardPage.selectInstallerRole(installerARN);
        cy.get('button').contains('Next').click({ force: true });
      });

      it('Step - Cluster Settings - Select advanced options', () => {
        CreateRosaWizardPage.isClusterDetailsScreen();
        cy.get(CreateRosaWizardPage.clusterNameInput).type(clusterName);
        CreateRosaWizardPage.clusterDetailsTree().click();
        CreateRosaWizardPage.selectAvailabilityZone('Multi-zone');
        CreateRosaWizardPage.advancedEncryptionLink().click();
        CreateRosaWizardPage.enableAdditionalEtcdEncryptionCheckbox().check();
        CreateRosaWizardPage.enableFIPSCryptographyCheckbox().check();
        CreateRosaWizardPage.advancedEncryptionLink().click();
        cy.get('button').contains('Next').click();
      });

      it('Step - Cluster Settings - machine pool- Select advanced options', () => {
        CreateRosaWizardPage.isClusterMachinepoolsScreen();
        CreateRosaWizardPage.selectComputeNodeType('m6id.xlarge');
        CreateRosaWizardPage.enableAutoScaling();
        CreateRosaWizardPage.setMinimumNodeCount('0');
        cy.get('span').contains('Input cannot be less than 1').should('be.visible');
        CreateRosaWizardPage.setMinimumNodeCount('200');
        cy.get('span').contains('Input cannot be more than 60').should('be.visible');
        CreateRosaWizardPage.setMaximumNodeCount('3');
        cy.get('span').contains('Max nodes cannot be less than min nodes').should('be.visible');
        CreateRosaWizardPage.setMinimumNodeCount('2');
        cy.get('span').contains('x 3 zones = 6').should('be.visible');
        CreateRosaWizardPage.setMaximumNodeCount('3');
        cy.get('span').contains('x 3 zones = 9').should('be.visible');
        CreateRosaWizardPage.useIMDSv2Radio().check();
        CreateRosaWizardPage.rootDiskSizeInput().type('{selectAll}').type('125');
        cy.get('div')
          .contains('The worker root disk size must be between 128 GiB and 1024 GiB.')
          .should('be.visible');
        CreateRosaWizardPage.rootDiskSizeInput().type('{selectAll}').type('1124');
        cy.get('div')
          .contains('The worker root disk size must be between 128 GiB and 1024 GiB.')
          .should('be.visible');
        CreateRosaWizardPage.rootDiskSizeInput().clear().type('{selectAll}').type('555');
        CreateRosaWizardPage.editNodeLabelLink().click();
        CreateRosaWizardPage.addNodeLabelKeyAndValue('smoke', 'tests', 0);
        CreateRosaWizardPage.addAdditionalLabelLink().click();
        CreateRosaWizardPage.addNodeLabelKeyAndValue('rosa', 'advanced', 1);
        cy.get('button').contains('Next').click();
      });

      it('Step - Networking', () => {
        cy.get('button').contains('Next').click();
      });

      it('Step - Networking - CIDR Ranges - advanced options', () => {
        CreateRosaWizardPage.useCIDRDefaultValues(false);
        cy.get('button').contains('Next').click();
      });

      it('Step - Cluster roles and policies - advanced  options', () => {
        CreateRosaWizardPage.selectRoleProviderMode('Auto');
        CreateRosaWizardPage.customOperatorPrefixInput().should('be.visible');
        CreateRosaWizardPage.customOperatorPrefixInput().invoke('val').should('not.be.empty');
        CreateRosaWizardPage.customOperatorPrefixInput().type('{selectAll}').type(clusterName);
        cy.get('button').contains('Next').click();
      });

      it('Step - Cluster update - update strategies - advanced options', () => {
        CreateRosaWizardPage.selectUpdateStratergy('Recurring updates');
        cy.get('button').contains('Next').click();
      });

      it('Cluster wizard revisit - Step - Accounts and roles', () => {
        cy.get('span').contains('Accounts and roles').next().click();
        CreateRosaWizardPage.isAccountsAndRolesScreen();
        CreateRosaWizardPage.waitForARNList();
        // Inline block fails due to HAC-4514.
        // CreateRosaWizardPage.supportRoleInput().should('have.value', 'arn:aws:iam::' + awsAccountID + ':role/' + rolePrefix + '-Support-Role');
        // CreateRosaWizardPage.workerRoleInput().should('have.value', 'arn:aws:iam::' + awsAccountID + ':role/' + rolePrefix + '-Worker-Role');
        // CreateRosaWizardPage.controlPlaneRoleInput().should('have.value', 'arn:aws:iam::' + awsAccountID + ':role/' + rolePrefix + '-ControlPlane-Role');
        CreateRosaWizardPage.selectInstallerRole(installerARN);
        cy.get('button').contains('Next').click();
      });
      it('Cluster wizard revisit - Step - cluster details', () => {
        cy.get(CreateRosaWizardPage.clusterNameInput).should('have.value', clusterName);
        CreateRosaWizardPage.multiZoneAvilabilityRadio().should('be.checked');
        CreateRosaWizardPage.advancedEncryptionLink().click();
        CreateRosaWizardPage.enableAdditionalEtcdEncryptionCheckbox().should('be.checked');
        CreateRosaWizardPage.enableFIPSCryptographyCheckbox().should('be.checked');
        CreateRosaWizardPage.advancedEncryptionLink().click();
        cy.get('button').contains('Next').click();
      });
      it('Cluster wizard revisit - Step - cluster details - machine pool', () => {
        CreateRosaWizardPage.minimumNodeInput().should('have.value', '2');
        CreateRosaWizardPage.maximumNodeInput().should('have.value', '3');
        CreateRosaWizardPage.rootDiskSizeInput().should('have.value', '555');
        CreateRosaWizardPage.useIMDSv2Radio().should('be.checked');
        CreateRosaWizardPage.editNodeLabelLink().click();
        CreateRosaWizardPage.isNodeLabelKeyAndValue('smoke', 'tests', 0);
        CreateRosaWizardPage.isNodeLabelKeyAndValue('rosa', 'advanced', 1);
        cy.get('button').contains('Next').click();
      });
      it('Cluster wizard revisit - Step - Networking', () => {
        // CreateRosaWizardPage.applicationIngressDefaultSettingsRadio().should('be.checked');
        CreateRosaWizardPage.clusterPrivacyPublicRadio().should('be.checked');
        cy.get('button').contains('Next').click();
        CreateRosaWizardPage.cidrDefaultValuesCheckBox().should('not.be.checked');
        CreateRosaWizardPage.machineCIDRInput().should('have.value', '10.0.0.0/16');
        CreateRosaWizardPage.serviceCIDRInput().should('have.value', '172.30.0.0/16');
        CreateRosaWizardPage.podCIDRInput().should('have.value', '10.128.0.0/16');
        CreateRosaWizardPage.hostPrefixInput().should('have.value', '/23');
        cy.get('button').contains('Next').click();
      });
      it('Cluster wizard revisit - Step - Cluster roles and policies', () => {
        CreateRosaWizardPage.createModeAutoRadio().should('be.checked');
        CreateRosaWizardPage.customOperatorPrefixInput().should('have.value', clusterName);
        cy.get('button').contains('Next').click();
      });
      it('Cluster wizard revisit - Step - cluster update strategies', () => {
        CreateRosaWizardPage.recurringUpdateRadio().should('be.checked');
        CreateRosaWizardPage.individualUpdateRadio().should('not.be.checked');
        cy.get('button').contains('Next').click();
      });

      it('Step - Review and create step -its definitions', () => {
        // Some situation the ARN spinner in progress and blocks cluster creation.
        cy.get('.pf-c-spinner', { timeout: 30000 }).should('not.exist');
        CreateRosaWizardPage.isClusterPropertyMatchesValue('Control plane', 'Classic');
        CreateRosaWizardPage.isClusterPropertyMatchesValue('Availability', 'Multi-zone');
        CreateRosaWizardPage.isClusterPropertyMatchesValue('User workload monitoring', 'Enabled');
        CreateRosaWizardPage.isClusterPropertyMatchesValue(
          'Encrypt volumes with customer keys',
          'Disabled',
        );
        CreateRosaWizardPage.isClusterPropertyMatchesValue('Additional etcd encryption', 'Enabled');
        CreateRosaWizardPage.isClusterPropertyMatchesValue('FIPS cryptography', 'Enabled');
        CreateRosaWizardPage.isClusterPropertyMatchesValue('Node instance type', 'm6id.xlarge');
        CreateRosaWizardPage.isClusterPropertyMatchesValue('Autoscaling', 'Enabled');
        CreateRosaWizardPage.isClusterPropertyMatchesValue('Install into existing VPC', 'Disabled');
        CreateRosaWizardPage.isClusterPropertyMatchesValue(
          'Instance Metadata Service (IMDS)',
          'IMDSv2',
        );
        CreateRosaWizardPage.isClusterPropertyMatchesValue('Worker root disk size', '555 GiB');
        CreateRosaWizardPage.isClusterPropertyMatchesValue('Cluster privacy', 'Public');
        CreateRosaWizardPage.isClusterPropertyMatchesValue('Machine CIDR', '10.0.0.0/16');
        CreateRosaWizardPage.isClusterPropertyMatchesValue('Service CIDR', '172.30.0.0/16');
        CreateRosaWizardPage.isClusterPropertyMatchesValue('Pod CIDR', '10.128.0.0/16');
        CreateRosaWizardPage.isClusterPropertyMatchesValue('Host prefix', '/23');
        CreateRosaWizardPage.isClusterPropertyMatchesValue(
          'Application ingress',
          'Use default settings',
        );
        CreateRosaWizardPage.isClusterPropertyMatchesValue('Host prefix', '/23');
        CreateRosaWizardPage.isClusterPropertyMatchesValue(
          'Operator roles and OIDC provider mode',
          'auto',
        );
        CreateRosaWizardPage.isClusterPropertyMatchesValue('Update strategy', 'Recurring updates');
        CreateRosaWizardPage.isClusterPropertyMatchesValue('Node draining', '60 minutes');
        CreateRosaWizardPage.reviewAndCreateTree().click();
      });

      it('Create Rosa advanced cluster and check the installation progress', () => {
        CreateRosaWizardPage.createClusterButton().click();
        ClusterDetailsPage.waitForInstallerScreenToLoad();
        ClusterDetailsPage.clusterNameTitle().contains(clusterName);
        cy.get('h2').contains('Installing cluster').should('be.visible');
        cy.get('a').contains('Download OC CLI').should('be.visible');
        ClusterDetailsPage.clusterDetailsPageRefresh();
        ClusterDetailsPage.checkInstallationStepStatus('Account setup');
        ClusterDetailsPage.checkInstallationStepStatus('OIDC and operator roles');
        ClusterDetailsPage.checkInstallationStepStatus('DNS setup');
        ClusterDetailsPage.checkInstallationStepStatus('Cluster installation');
        ClusterDetailsPage.clusterTypeLabelValue().contains('ROSA');
        ClusterDetailsPage.clusterAvailabilityLabelValue().contains('Multi-zone');
        ClusterDetailsPage.clusterInfrastructureAWSaccountLabelValue().contains(awsAccountID);
        ClusterDetailsPage.clusterFipsCryptographyStatus().contains('FIPS Cryptography enabled');
        ClusterDetailsPage.clusterIMDSValue().contains('IMDSv2 only');
        ClusterDetailsPage.clusterAutoScalingStatus().contains('Enabled');
        ClusterDetailsPage.clusterAdditionalEncryptionStatus().contains('Enabled');
        ClusterDetailsPage.clusterMachineCIDRLabelValue('10.0.0.0/16');
        ClusterDetailsPage.clusterServiceCIDRLabelValue('172.30.0.0/16');
        ClusterDetailsPage.clusterPodCIDRLabelValue('10.128.0.0/16');
        ClusterDetailsPage.clusterHostPrefixLabelValue('/23');
      });
      it('Delete the advanced ROSA cluster', () => {
        ClusterDetailsPage.actionsDropdownToggle().click();
        ClusterDetailsPage.deleteClusterDropdownItem().click();
        ClusterDetailsPage.deleteClusterNameInput().clear().type(clusterName);
        ClusterDetailsPage.deleteClusterConfirm().click();
        ClusterDetailsPage.waitForDeleteClusterActionComplete();
      });
    });
  },
);
