import CreateRosaWizardPage from '../../pageobjects/CreateRosaWizard.page';
import ClusterDetailsPage from '../../pageobjects/ClusterDetails.page';
const clusterPropertiesFile = require('../../fixtures/rosa/RosaClusterDefaultPublicMultiZoneProperties.json');

const awsAccountID = Cypress.env('QE_AWS_ID');
const rolePrefix = Cypress.env('QE_ACCOUNT_ROLE_PREFIX');
const installerARN = 'arn:aws:iam::' + awsAccountID + ':role/' + rolePrefix + '-Installer-Role';
const clusterName = clusterPropertiesFile.ClusterName;

describe(
  'Rosa cluster Creation-multizone-public-default settings',
  { tags: ['day1', 'rosa', 'public', 'multi-zone', 'default'] },
  () => {
    it('Open Rosa cluster wizard', () => {
      cy.getByTestId('create_cluster_btn').click();
      CreateRosaWizardPage.rosaCreateClusterButton().click();
      CreateRosaWizardPage.rosaClusterWithWeb().should('be.visible').click();
      CreateRosaWizardPage.isCreateRosaPage();
      cy.get('.spinner-loading-text').should('not.exist');
    });

    it('Step - Control plane - Select control plane type', () => {
      CreateRosaWizardPage.isControlPlaneTypeScreen();
      CreateRosaWizardPage.selectStandaloneControlPlaneTypeOption();
      CreateRosaWizardPage.rosaNextButton().click();
    });

    it('Step - Accounts and roles - Select Account roles, ARN definitions', () => {
      CreateRosaWizardPage.isAccountsAndRolesScreen();
      CreateRosaWizardPage.selectAWSInfrastructureAccount(awsAccountID);
      CreateRosaWizardPage.refreshInfrastructureAWSAccountButton().click();
      CreateRosaWizardPage.waitForARNList();
      CreateRosaWizardPage.selectInstallerRole(installerARN);
      CreateRosaWizardPage.rosaNextButton().click();
    });

    it('Step - Cluster Settings - Select Cluster name, version, regions', () => {
      CreateRosaWizardPage.isClusterDetailsScreen();
      cy.get(CreateRosaWizardPage.clusterNameInput).type(clusterName);
      CreateRosaWizardPage.hideClusterNameValidation();
      CreateRosaWizardPage.selectClusterVersion(clusterPropertiesFile.Version);
      CreateRosaWizardPage.selectRegion(clusterPropertiesFile.Region);
      CreateRosaWizardPage.selectAvailabilityZone(clusterPropertiesFile.Availability);
      CreateRosaWizardPage.rosaNextButton().click();
    });

    it('Step - Cluster Settings - Select machine pool node type and node count', () => {
      CreateRosaWizardPage.isClusterMachinepoolsScreen();
      CreateRosaWizardPage.selectComputeNodeType(
        clusterPropertiesFile.MachinePools[0].InstanceType,
      );
      CreateRosaWizardPage.enableAutoScaling();
      CreateRosaWizardPage.disabledAutoScaling();
      CreateRosaWizardPage.selectComputeNodeCount(clusterPropertiesFile.MachinePools[0].NodeCount);
      CreateRosaWizardPage.rosaNextButton().click();
    });

    it('Step - Cluster Settings - configuration - Select cluster privacy', () => {
      CreateRosaWizardPage.selectClusterPrivacy('private');
      CreateRosaWizardPage.selectClusterPrivacy(clusterPropertiesFile.ClusterPrivacy);
      CreateRosaWizardPage.rosaNextButton().click();
    });

    it('Step - Cluster Settings - CIDR Ranges - CIDR default values', () => {
      CreateRosaWizardPage.useCIDRDefaultValues(false);
      CreateRosaWizardPage.useCIDRDefaultValues(true);
      CreateRosaWizardPage.machineCIDRInput().should(
        'have.value',
        clusterPropertiesFile.MachineCIDR,
      );
      CreateRosaWizardPage.serviceCIDRInput().should(
        'have.value',
        clusterPropertiesFile.ServiceCIDR,
      );
      CreateRosaWizardPage.podCIDRInput().should('have.value', clusterPropertiesFile.PodCIDR);
      CreateRosaWizardPage.hostPrefixInput().should('have.value', clusterPropertiesFile.HostPrefix);
      CreateRosaWizardPage.rosaNextButton().click();
    });

    it('Step - Cluster roles and policies - role provider mode and its definitions', () => {
      CreateRosaWizardPage.selectRoleProviderMode(clusterPropertiesFile.RoleProviderMode);
      CreateRosaWizardPage.customOperatorPrefixInput().should('be.visible');
      CreateRosaWizardPage.customOperatorPrefixInput().invoke('val').should('include', clusterName);
      CreateRosaWizardPage.rosaNextButton().click();
    });

    it('Step - Cluster update - update strategies and its definitions', () => {
      CreateRosaWizardPage.selectUpdateStratergy(clusterPropertiesFile.UpdateStrategy);
      CreateRosaWizardPage.rosaNextButton().click();
    });

    it('Step - Review and create : Accounts and roles definitions', () => {
      CreateRosaWizardPage.isClusterPropertyMatchesValue(
        'Control plane',
        clusterPropertiesFile.ControlPlaneType,
      );
      CreateRosaWizardPage.isClusterPropertyMatchesValue(
        'AWS infrastructure account ID',
        awsAccountID,
      );
      CreateRosaWizardPage.isClusterPropertyMatchesValue('Installer role', installerARN);
    });

    it('Step - Review and create : Cluster Settings definitions', () => {
      CreateRosaWizardPage.isClusterPropertyMatchesValue('Cluster name', clusterName);
      CreateRosaWizardPage.isClusterPropertyMatchesValue('Version', clusterPropertiesFile.Version);
      CreateRosaWizardPage.isClusterPropertyMatchesValue(
        'Region',
        clusterPropertiesFile.Region.split(',')[0],
      );
      CreateRosaWizardPage.isClusterPropertyMatchesValue(
        'Availability',
        clusterPropertiesFile.Availability,
      );
      CreateRosaWizardPage.isClusterPropertyMatchesValue(
        'Encrypt volumes with customer keys',
        clusterPropertiesFile.EncryptVolumesWithCustomerKeys,
      );
      CreateRosaWizardPage.isClusterPropertyMatchesValue(
        'Additional etcd encryption',
        clusterPropertiesFile.AdditionalEncryption,
      );
      CreateRosaWizardPage.isClusterPropertyMatchesValue(
        'FIPS cryptography',
        clusterPropertiesFile.FIPSCryptography,
      );
    });

    it('Step - Review and create : Machine pool definitions', () => {
      CreateRosaWizardPage.isClusterPropertyMatchesValue(
        'Node instance type',
        clusterPropertiesFile.MachinePools[0].InstanceType,
      );
      CreateRosaWizardPage.isClusterPropertyMatchesValue(
        'Autoscaling',
        clusterPropertiesFile.MachinePools[0].Autoscaling,
      );
      CreateRosaWizardPage.isClusterPropertyMatchesValue(
        'Compute node count',
        clusterPropertiesFile.MachinePools[0].NodeCount,
      );
      CreateRosaWizardPage.isClusterPropertyMatchesValue(
        'Install into existing VPC',
        clusterPropertiesFile.InstallIntoExistingVPC,
      );
      CreateRosaWizardPage.isClusterPropertyMatchesValue(
        'Instance Metadata Service (IMDS)',
        clusterPropertiesFile.InstanceMetadataService,
      );
    });

    it('Step - Review and create : Networking definitions', () => {
      CreateRosaWizardPage.isClusterPropertyMatchesValue(
        'Cluster privacy',
        clusterPropertiesFile.ClusterPrivacy,
      );
      CreateRosaWizardPage.isClusterPropertyMatchesValue(
        'Machine CIDR',
        clusterPropertiesFile.MachineCIDR,
      );
      CreateRosaWizardPage.isClusterPropertyMatchesValue(
        'Service CIDR',
        clusterPropertiesFile.ServiceCIDR,
      );
      CreateRosaWizardPage.isClusterPropertyMatchesValue('Pod CIDR', clusterPropertiesFile.PodCIDR);
      CreateRosaWizardPage.isClusterPropertyMatchesValue(
        'Host prefix',
        clusterPropertiesFile.HostPrefix,
      );
    });

    it('Step - Review and create : cluster roles and update definitions', () => {
      CreateRosaWizardPage.isClusterPropertyMatchesValue(
        'Operator roles and OIDC provider mode',
        clusterPropertiesFile.RoleProviderMode.toLowerCase(),
      );
      CreateRosaWizardPage.isClusterPropertyMatchesValue(
        'Update strategy',
        clusterPropertiesFile.UpdateStrategy,
      );
    });

    it('Create cluster and check the installation progress', () => {
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
    });
  },
);
