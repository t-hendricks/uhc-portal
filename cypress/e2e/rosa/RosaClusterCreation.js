import Login from '../../pageobjects/login.page';
import ClusterListPage from '../../pageobjects/ClusterList.page';
import CreateRosaWizardPage from '../../pageobjects/CreateRosaWizard.page';
import ClusterDetailsPage from '../../pageobjects/ClusterDetails.page';

// awsAccountID,rolePrefix and installerARN are set by prerun script for smoke requirements.
const awsAccountID = Cypress.env("QE_AWS_ID");
const rolePrefix = 'cypress-account-roles'
const installerARN = 'arn:aws:iam::' + awsAccountID + ':role/' + rolePrefix + '-Installer-Role'
const clusterName = `smkrosa-` + (Math.random() + 1).toString(36).substring(7);
const clusterVersion = '4.12.25';

describe('Rosa cluster wizard checks and cluster creation tests(OCP-50261)', { tags: ['smoke'] }, () => {
  before(() => {
    cy.visit('/?fake=true');
    Login.isLoginPageUrl();
    Login.login();

    ClusterListPage.isClusterListUrl();
    ClusterListPage.waitForDataReady();
    cy.getByTestId('create_cluster_btn').should('be.visible');
  });

  describe('Launch ROSA Wizard ,Select default values,Create cluster', () => {

    it('Open Rosa cluster wizard', () => {
      cy.getByTestId('create_cluster_btn').click();
      cy.get('#rosa-create-cluster-dropdown').scrollIntoView().should('be.visible');
      cy.get('#rosa-create-cluster-dropdown').click();
      cy.get('#with-web').should('be.visible');
      cy.get('#with-web').click();
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
      // duplicated steps because installer ARNs are not populated as per account selection for the first time.
      CreateRosaWizardPage.refreshInfrastructureAWSAccountButton().click();
      CreateRosaWizardPage.waitForARNList();
      CreateRosaWizardPage.selectInstallerRole(installerARN);
      cy.get('button').contains('Next').click();
    });

    it('Step - Cluster Settings - Select Cluster name, version, regions', () => {
      CreateRosaWizardPage.isClusterDetailsScreen();
      cy.get(CreateRosaWizardPage.clusterNameInput).type(clusterName);
      CreateRosaWizardPage.clusterDetailsTree().click();
      CreateRosaWizardPage.selectClusterVersion(clusterVersion);
      CreateRosaWizardPage.selectRegion('us-west-2, US West, Oregon');
      cy.get('button').contains('Next').click();
    });

    it('Step - Cluster Settings - Select machine pool node type and node count', () => {
      CreateRosaWizardPage.isClusterMachinepoolsScreen();
      CreateRosaWizardPage.selectComputeNodeType('m6id.xlarge');
      CreateRosaWizardPage.enableAutoScaling();
      CreateRosaWizardPage.disabledAutoScaling();
      CreateRosaWizardPage.selectComputeNodeCount('4');
      cy.get('button').contains('Next').click();
    });

    it('Step - Cluster Settings - configuration - Select cluster privacy', () => {
      CreateRosaWizardPage.selectClusterPrivacy('private');
      CreateRosaWizardPage.selectClusterPrivacy('public');
      cy.get('button').contains('Next').click();
    });

    it('Step - Cluster Settings - CIDR Ranges - CIDR default values', () => {
      CreateRosaWizardPage.useCIDRDefaultValues(false);
      CreateRosaWizardPage.useCIDRDefaultValues(true);
      CreateRosaWizardPage.machineCIDRInput().should('have.value', '10.0.0.0/16');
      CreateRosaWizardPage.serviceCIDRInput().should('have.value', '172.30.0.0/16');
      CreateRosaWizardPage.podCIDRInput().should('have.value', '10.128.0.0/16');
      CreateRosaWizardPage.hostPrefixInput().should('have.value', '/23');
      cy.get('button').contains('Next').click();
    });

    it('Step - Cluster roles and policies - role provider mode and its definitions', () => {
      CreateRosaWizardPage.selectRoleProviderMode('Auto');
      CreateRosaWizardPage.customOperatorPrefixInput().should('be.visible');
      CreateRosaWizardPage.customOperatorPrefixInput().invoke('val').should('not.be.empty')
      cy.get('button').contains('Next').click();
    });

    it('Step - Cluster update - update statergies and its definitions', () => {
      CreateRosaWizardPage.selectUpdateStratergy("Recurring updates");
      cy.get('button').contains('Next').click();
    });

    it('Step - Review and create : Accounts and roles definitions', () => {
      CreateRosaWizardPage.isClusterPropertyMatchesValue('Control plane', 'Classic');
      CreateRosaWizardPage.isClusterPropertyMatchesValue('AWS infrastructure account ID', awsAccountID);
      CreateRosaWizardPage.isClusterPropertyMatchesValue('Installer role', installerARN);
    });

    it('Step - Review and create : Cluster Settings definitions', () => {
      CreateRosaWizardPage.isClusterPropertyMatchesValue('Cluster name', clusterName);
      CreateRosaWizardPage.isClusterPropertyMatchesValue('Version', clusterVersion);
      CreateRosaWizardPage.isClusterPropertyMatchesValue('Region', 'us-west-2');
      CreateRosaWizardPage.isClusterPropertyMatchesValue('Availability', 'Single zone');
      CreateRosaWizardPage.isClusterPropertyMatchesValue('Encrypt volumes with customer keys', 'Disabled');
      CreateRosaWizardPage.isClusterPropertyMatchesValue('Additional etcd encryption', 'Disabled');
      CreateRosaWizardPage.isClusterPropertyMatchesValue('FIPS cryptography', 'Disabled');
    });

    it('Step - Review and create : Machine pool definitions', () => {
      CreateRosaWizardPage.isClusterPropertyMatchesValue('Node instance type', 'm6id.xlarge');
      CreateRosaWizardPage.isClusterPropertyMatchesValue('Autoscaling', 'Disabled');
      CreateRosaWizardPage.isClusterPropertyMatchesValue('Compute node count', '4');
      CreateRosaWizardPage.isClusterPropertyMatchesValue('Install into existing VPC', 'Disabled');
      CreateRosaWizardPage.isClusterPropertyMatchesValue('Instance Metadata Service (IMDS)', 'IMDSv1 and IMDSv2');
    });

    it('Step - Review and create : Networking definitions', () => {
      CreateRosaWizardPage.isClusterPropertyMatchesValue('Cluster privacy', 'Public');
      CreateRosaWizardPage.isClusterPropertyMatchesValue('Machine CIDR', '10.0.0.0/16');
      CreateRosaWizardPage.isClusterPropertyMatchesValue('Service CIDR', '172.30.0.0/16');
      CreateRosaWizardPage.isClusterPropertyMatchesValue('Pod CIDR', '10.128.0.0/16');
      CreateRosaWizardPage.isClusterPropertyMatchesValue('Host prefix', '/23');
    });

    it('Step - Review and create : cluster roles and update definitions', () => {
      CreateRosaWizardPage.isClusterPropertyMatchesValue('Operator roles and OIDC provider mode', 'auto');
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
      ClusterDetailsPage.clusterRegionLabelValue().contains('us-west-2');
      ClusterDetailsPage.clusterAvailabilityLabelValue().contains('Single zone');
      ClusterDetailsPage.clusterInfrastructureAWSaccountLabelValue().contains(awsAccountID);
      ClusterDetailsPage.actionsDropdownToggle().click();
      ClusterDetailsPage.deleteClusterDropdownItem().click();
      ClusterDetailsPage.deleteClusterNameInput().clear().type(clusterName);
      ClusterDetailsPage.deleteClusterConfirm().click();
      ClusterDetailsPage.waitForDeleteClusterActionComplete();
    });
  });
});
