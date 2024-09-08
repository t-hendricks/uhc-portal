import ClusterDetailsPage from '../../pageobjects/ClusterDetails.page';
import CreateRosaWizardPage from '../../pageobjects/CreateRosaWizard.page';
import CreateClusterPage from '../../pageobjects/CreateCluster.page';
import OverviewPage from '../../pageobjects/Overview.page';

// awsAccountID,rolePrefix and installerARN are set by prerun script for smoke requirements.
const awsAccountID = Cypress.env('QE_AWS_ID');
const rolePrefix = Cypress.env('QE_ACCOUNT_ROLE_PREFIX');
const installerARN = `arn:aws:iam::${awsAccountID}:role/${rolePrefix}-Installer-Role`;
const clusterName = `ocmui-cypress-smoke-rosa-${(Math.random() + 1).toString(36).substring(7)}`;
const clusterDomainPrefix = `rosa${(Math.random() + 1).toString(36).substring(2)}`;

describe(
  'Rosa cluster wizard checks and cluster creation tests(OCP-50261)',
  { tags: ['smoke'] },
  () => {
    before(() => {
      OverviewPage.viewAllOpenshiftClusterTypesLink().click();
      CreateClusterPage.isCreateClusterPageHeaderVisible();
    });

    it('Open Rosa cluster wizard', () => {
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
      CreateRosaWizardPage.howToAssociateNewAWSAccountButton().click();
      CreateRosaWizardPage.isAssociateAccountsDrawer();
      CreateRosaWizardPage.howToAssociateNewAWSAccountDrawerCloseButton().click();
      CreateRosaWizardPage.selectAWSInfrastructureAccount(awsAccountID);
      CreateRosaWizardPage.waitForARNList();
      CreateRosaWizardPage.refreshInfrastructureAWSAccountButton().click();
      CreateRosaWizardPage.waitForARNList();
      CreateRosaWizardPage.selectInstallerRole(installerARN);
      CreateRosaWizardPage.rosaNextButton().click();
    });

    it('Step - Cluster Settings - Select Cluster name, version, regions', () => {
      CreateRosaWizardPage.isClusterDetailsScreen();
      CreateRosaWizardPage.setClusterName(clusterName);
      CreateRosaWizardPage.closePopoverDialogs();
      CreateRosaWizardPage.createCustomDomainPrefixCheckbox().check();
      CreateRosaWizardPage.setDomainPrefix(clusterDomainPrefix);
      CreateRosaWizardPage.closePopoverDialogs();
      CreateRosaWizardPage.selectRegion('us-west-2, US West, Oregon');
      CreateRosaWizardPage.rosaNextButton().click();
    });

    it('Step - Cluster Settings - Select machine pool node type and node count', () => {
      CreateRosaWizardPage.isClusterMachinepoolsScreen();
      CreateRosaWizardPage.selectComputeNodeType('m6id.xlarge');
      CreateRosaWizardPage.enableAutoScaling();
      CreateRosaWizardPage.disabledAutoScaling();
      CreateRosaWizardPage.selectComputeNodeCount('4');
      CreateRosaWizardPage.rosaNextButton().click();
    });

    it('Step - Cluster Settings - configuration - Select cluster privacy', () => {
      CreateRosaWizardPage.clusterPrivacyPublicRadio().should('be.checked');
      CreateRosaWizardPage.clusterPrivacyPrivateRadio().should('not.be.checked');
      CreateRosaWizardPage.selectClusterPrivacy('private');
      CreateRosaWizardPage.selectClusterPrivacy('public');
      CreateRosaWizardPage.rosaNextButton().click();
    });

    it('Step - Cluster Settings - CIDR Ranges - CIDR default values', () => {
      CreateRosaWizardPage.cidrDefaultValuesCheckBox().should('be.checked');
      CreateRosaWizardPage.useCIDRDefaultValues(false);
      CreateRosaWizardPage.useCIDRDefaultValues(true);
      CreateRosaWizardPage.machineCIDRInput().should('have.value', '10.0.0.0/16');
      CreateRosaWizardPage.serviceCIDRInput().should('have.value', '172.30.0.0/16');
      CreateRosaWizardPage.podCIDRInput().should('have.value', '10.128.0.0/14');
      CreateRosaWizardPage.hostPrefixInput().should('have.value', '/23');
      CreateRosaWizardPage.rosaNextButton().click();
    });

    it('Step - Cluster roles and policies - role provider mode and its definitions', () => {
      CreateRosaWizardPage.createModeAutoRadio().should('be.checked');
      CreateRosaWizardPage.createModeManualRadio().should('not.be.checked');
      CreateRosaWizardPage.selectRoleProviderMode('Manual');
      CreateRosaWizardPage.selectRoleProviderMode('Auto');
      CreateRosaWizardPage.customOperatorPrefixInput().should('be.visible');
      CreateRosaWizardPage.customOperatorPrefixInput()
        .invoke('val')
        .should('include', clusterName.slice(0, 27));
      CreateRosaWizardPage.rosaNextButton().click();
    });

    it('Step - Cluster update - update statergies and its definitions', () => {
      CreateRosaWizardPage.individualUpdateRadio().should('be.checked');
      CreateRosaWizardPage.recurringUpdateRadio().should('not.be.checked');
      CreateRosaWizardPage.selectUpdateStratergy('Recurring updates');
      CreateRosaWizardPage.rosaNextButton().click();
    });

    it('Step - Review and create : Accounts and roles definitions', () => {
      CreateRosaWizardPage.isClusterPropertyMatchesValue('Control plane', 'Classic');
      CreateRosaWizardPage.isClusterPropertyMatchesValue(
        'AWS infrastructure account ID',
        awsAccountID,
      );
      CreateRosaWizardPage.isClusterPropertyMatchesValue('Installer role', installerARN);
    });

    it('Step - Review and create : Cluster Settings definitions', () => {
      CreateRosaWizardPage.isClusterPropertyMatchesValue('Cluster name', clusterName);
      CreateRosaWizardPage.isClusterPropertyMatchesValue('Domain prefix', clusterDomainPrefix);
      CreateRosaWizardPage.isClusterPropertyMatchesValue('Region', 'us-west-2');
      CreateRosaWizardPage.isClusterPropertyMatchesValue('Availability', 'Single zone');
      CreateRosaWizardPage.isClusterPropertyMatchesValue(
        'Encrypt volumes with customer keys',
        'Disabled',
      );
      CreateRosaWizardPage.isClusterPropertyMatchesValue('Additional etcd encryption', 'Disabled');
      CreateRosaWizardPage.isClusterPropertyMatchesValue('FIPS cryptography', 'Disabled');
    });

    it('Step - Review and create : Machine pool definitions', () => {
      CreateRosaWizardPage.isClusterPropertyMatchesValue('Node instance type', 'm6id.xlarge');
      CreateRosaWizardPage.isClusterPropertyMatchesValue('Autoscaling', 'Disabled');
      CreateRosaWizardPage.isClusterPropertyMatchesValue('Compute node count', '4');
      CreateRosaWizardPage.isClusterPropertyMatchesValue('Install into existing VPC', 'Disabled');
      CreateRosaWizardPage.isClusterPropertyMatchesValue(
        'Instance Metadata Service (IMDS)',
        'IMDSv1 and IMDSv2',
      );
    });

    it('Step - Review and create : Networking definitions', () => {
      CreateRosaWizardPage.isClusterPropertyMatchesValue('Cluster privacy', 'Public');
      CreateRosaWizardPage.isClusterPropertyMatchesValue('Machine CIDR', '10.0.0.0/16');
      CreateRosaWizardPage.isClusterPropertyMatchesValue('Service CIDR', '172.30.0.0/16');
      CreateRosaWizardPage.isClusterPropertyMatchesValue('Pod CIDR', '10.128.0.0/14');
      CreateRosaWizardPage.isClusterPropertyMatchesValue('Host prefix', '/23');
    });

    it('Step - Review and create : cluster roles and update definitions', () => {
      CreateRosaWizardPage.isClusterPropertyMatchesValue(
        'Operator roles and OIDC provider mode',
        'auto',
      );
      CreateRosaWizardPage.isClusterPropertyMatchesValue('Update strategy', 'Recurring updates');
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
      ClusterDetailsPage.clusterTypeLabelValue().contains('ROSA');
      ClusterDetailsPage.clusterDomainPrefixLabelValue().contains(clusterDomainPrefix);
      ClusterDetailsPage.clusterRegionLabelValue().contains('us-west-2');
      ClusterDetailsPage.clusterAvailabilityLabelValue().contains('Single zone');
      ClusterDetailsPage.clusterInfrastructureAWSaccountLabelValue().contains(awsAccountID);
      ClusterDetailsPage.clusterMachineCIDRLabelValue().contains('10.0.0.0/16');
      ClusterDetailsPage.clusterServiceCIDRLabelValue().contains('172.30.0.0/16');
      ClusterDetailsPage.clusterPodCIDRLabelValue().contains('10.128.0.0/14');
      ClusterDetailsPage.clusterHostPrefixLabelValue().contains('23');
    });
    it('Delete the cluster', () => {
      ClusterDetailsPage.actionsDropdownToggle().click();
      ClusterDetailsPage.deleteClusterDropdownItem().click();
      ClusterDetailsPage.deleteClusterNameInput().clear().type(clusterName);
      ClusterDetailsPage.deleteClusterConfirm().click();
      ClusterDetailsPage.waitForDeleteClusterActionComplete();
    });
  },
);
