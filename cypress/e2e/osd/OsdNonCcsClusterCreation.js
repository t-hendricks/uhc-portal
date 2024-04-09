import ClusterDetailsPage from '../../pageobjects/ClusterDetails.page';
import CreateOSDWizardPage from '../../pageobjects/CreateOSDWizard.page';

const QE_GCP = Cypress.env('QE_GCP_OSDCCSADMIN_JSON');
const clusterPropertiesFile = require('../../fixtures/osd/OsdNonCcsClusterProperties.json');

describe('OSD Non CCS cluster creation tests(OCP-42746)', { tags: ['smoke'] }, () => {
  beforeEach(() => {
    if (Cypress.currentTest.title.match(/Launch OSD.*cluster wizard/g)) {
      cy.visit('/create');
    }
  });

  it(`Launch OSD - ${clusterPropertiesFile.CloudProvider} cluster wizard`, () => {
    CreateOSDWizardPage.osdCreateClusterButton().click();
    CreateOSDWizardPage.isCreateOSDPage();
  });

  it(`OSD ${clusterPropertiesFile.CloudProvider} wizard - Billing model and its definitions`, () => {
    CreateOSDWizardPage.isBillingModelScreen();
    CreateOSDWizardPage.subscriptionTypeAnnualFixedCapacityRadio().should('be.checked');
    CreateOSDWizardPage.infrastructureTypeRedHatCloudAccountRadio().check();

    cy.get(CreateOSDWizardPage.primaryButton).click();
  });

  it(`OSD ${clusterPropertiesFile.CloudProvider} wizard - Cluster Settings - Cloud provider definitions`, () => {
    CreateOSDWizardPage.isCloudProviderSelectionScreen();
    CreateOSDWizardPage.selectCloudProvider(clusterPropertiesFile.CloudProvider);

    cy.get(CreateOSDWizardPage.primaryButton).click();
  });

  it(`OSD ${clusterPropertiesFile.CloudProvider} wizard - Cluster Settings - Cluster details definitions`, () => {
    CreateOSDWizardPage.isClusterDetailsScreen();
    cy.get(CreateOSDWizardPage.clusterNameInput).type(clusterPropertiesFile.ClusterName);
    CreateOSDWizardPage.hideClusterNameValidation();
    CreateOSDWizardPage.singleZoneAvilabilityRadio().should('be.checked');

    CreateOSDWizardPage.selectRegion(clusterPropertiesFile.Region);
    CreateOSDWizardPage.selectPersistentStorage(clusterPropertiesFile.PersistentStorage);
    CreateOSDWizardPage.selectLoadBalancers(clusterPropertiesFile.LoadBalancers);

    CreateOSDWizardPage.enableUserWorkloadMonitoringCheckbox().should('be.checked');

    cy.get(CreateOSDWizardPage.primaryButton).click();
  });

  it(`OSD ${clusterPropertiesFile.CloudProvider} wizard - Cluster Settings - Default machinepool definitions`, () => {
    CreateOSDWizardPage.isMachinePoolScreen();
    CreateOSDWizardPage.selectComputeNodeType(clusterPropertiesFile.MachinePools[0].InstanceType);

    CreateOSDWizardPage.selectComputeNodeCount(clusterPropertiesFile.MachinePools[0].NodeCount);
    CreateOSDWizardPage.enableAutoscalingCheckbox().should('not.be.checked');

    CreateOSDWizardPage.addNodeLabelLink().should('be.visible');

    cy.get(CreateOSDWizardPage.primaryButton).click();
  });

  it(`OSD ${clusterPropertiesFile.CloudProvider} wizard - Networking configuration - cluster privacy definitions`, () => {
    CreateOSDWizardPage.isCIDRScreen();
    CreateOSDWizardPage.cidrDefaultValuesCheckBox().should('be.checked');
    CreateOSDWizardPage.machineCIDRInput().should('have.value', clusterPropertiesFile.MachineCIDR);
    CreateOSDWizardPage.serviceCIDRInput().should('have.value', clusterPropertiesFile.ServiceCIDR);
    CreateOSDWizardPage.podCIDRInput().should('have.value', clusterPropertiesFile.PodCIDR);
    CreateOSDWizardPage.hostPrefixInput().should('have.value', clusterPropertiesFile.HostPrefix);
    cy.get(CreateOSDWizardPage.primaryButton).click();
  });

  it(`OSD ${clusterPropertiesFile.CloudProvider}) wizard - Cluster updates definitions`, () => {
    CreateOSDWizardPage.isUpdatesScreen();
    CreateOSDWizardPage.updateStrategyIndividualRadio().should('be.checked');
    CreateOSDWizardPage.selectNodeDraining(clusterPropertiesFile.NodeDraining);

    cy.get(CreateOSDWizardPage.primaryButton).click();
  });

  it(`OSD ${clusterPropertiesFile.CloudProvider} wizard - Review and create page and its definitions`, () => {
    CreateOSDWizardPage.isReviewScreen();
    CreateOSDWizardPage.subscriptionTypeValue().contains(clusterPropertiesFile.SubscriptionType);
    CreateOSDWizardPage.infrastructureTypeValue().contains(
      clusterPropertiesFile.InfrastructureType,
    );
    CreateOSDWizardPage.cloudProviderValue().contains(clusterPropertiesFile.CloudProvider);
    CreateOSDWizardPage.clusterNameValue().contains(clusterPropertiesFile.ClusterName);
    CreateOSDWizardPage.regionValue().contains(clusterPropertiesFile.Region.split(',')[0]);
    CreateOSDWizardPage.availabilityValue().contains(clusterPropertiesFile.Availability);
    CreateOSDWizardPage.userWorkloadMonitoringValue().contains(
      clusterPropertiesFile.UserWorkloadMonitoring,
    );
    CreateOSDWizardPage.persistentStorageValue().contains(clusterPropertiesFile.PersistentStorage);
    CreateOSDWizardPage.additionalEtcdEncryptionValue().contains(
      clusterPropertiesFile.AdditionalEncryption,
    );
    CreateOSDWizardPage.fipsCryptographyValue().contains(clusterPropertiesFile.FIPSCryptography);
    CreateOSDWizardPage.nodeInstanceTypeValue().contains(
      clusterPropertiesFile.MachinePools[0].InstanceType,
    );
    CreateOSDWizardPage.autoscalingValue().contains(
      clusterPropertiesFile.MachinePools[0].Autoscaling,
    );
    CreateOSDWizardPage.computeNodeCountValue().contains(
      clusterPropertiesFile.MachinePools[0].NodeCount,
    );

    CreateOSDWizardPage.clusterPrivacyValue().contains(clusterPropertiesFile.ClusterPrivacy);
    CreateOSDWizardPage.machineCIDRValue().contains(clusterPropertiesFile.MachineCIDR);
    CreateOSDWizardPage.serviceCIDRValue().contains(clusterPropertiesFile.ServiceCIDR);
    CreateOSDWizardPage.podCIDRValue().contains(clusterPropertiesFile.PodCIDR);
    CreateOSDWizardPage.hostPrefixValue().contains(clusterPropertiesFile.HostPrefix);

    CreateOSDWizardPage.updateStratergyValue().contains(clusterPropertiesFile.UpdateStrategy);
    CreateOSDWizardPage.nodeDrainingValue(
      `${clusterPropertiesFile.NodeDraining} × 60 = ${clusterPropertiesFile.NodeDraining} minutes`,
    );
  });

  it(`OSD ${clusterPropertiesFile.CloudProvider} wizard - Cluster submission & overview definitions`, () => {
    CreateOSDWizardPage.createClusterButton().click();
    ClusterDetailsPage.waitForInstallerScreenToLoad();
    ClusterDetailsPage.clusterNameTitle().contains(clusterPropertiesFile.ClusterName);
    ClusterDetailsPage.clusterInstallationHeader()
      .contains('Installing cluster')
      .should('be.visible');
    ClusterDetailsPage.clusterInstallationExpectedText()
      .contains('Cluster creation usually takes 30 to 60 minutes to complete')
      .should('be.visible');
    ClusterDetailsPage.downloadOcCliLink().contains('Download OC CLI').should('be.visible');
    ClusterDetailsPage.clusterDetailsPageRefresh();
    ClusterDetailsPage.checkInstallationStepStatus('Account setup');
    ClusterDetailsPage.checkInstallationStepStatus('Network settings');
    ClusterDetailsPage.checkInstallationStepStatus('DNS setup');
    ClusterDetailsPage.checkInstallationStepStatus('Cluster installation');
    ClusterDetailsPage.clusterTypeLabelValue().contains(clusterPropertiesFile.Type);
    ClusterDetailsPage.clusterRegionLabelValue().contains(
      clusterPropertiesFile.Region.split(',')[0],
    );
    ClusterDetailsPage.clusterPersistentStorageLabelValue().contains(
      clusterPropertiesFile.PersistentStorage,
    );
    ClusterDetailsPage.clusterAvailabilityLabelValue().contains(clusterPropertiesFile.Availability);
    ClusterDetailsPage.clusterMachineCIDRLabelValue().contains(clusterPropertiesFile.MachineCIDR);
    ClusterDetailsPage.clusterServiceCIDRLabelValue().contains(clusterPropertiesFile.ServiceCIDR);
    ClusterDetailsPage.clusterPodCIDRLabelValue().contains(clusterPropertiesFile.PodCIDR);
    ClusterDetailsPage.clusterHostPrefixLabelValue().contains(
      clusterPropertiesFile.HostPrefix.replace('/', ''),
    );
    ClusterDetailsPage.clusterSubscriptionBillingModelValue().contains(
      clusterPropertiesFile.SubscriptionBillingModel,
    );
    ClusterDetailsPage.clusterInfrastructureBillingModelValue().contains(
      clusterPropertiesFile.InfrastructureType,
    );
  });

  it(`Delete OSD ${clusterPropertiesFile.CloudProvider} cluster`, () => {
    ClusterDetailsPage.actionsDropdownToggle().click();
    ClusterDetailsPage.deleteClusterDropdownItem().click();
    ClusterDetailsPage.deleteClusterNameInput().clear().type(clusterPropertiesFile.ClusterName);
    ClusterDetailsPage.deleteClusterConfirm().click();
    ClusterDetailsPage.waitForDeleteClusterActionComplete();
  });
});
