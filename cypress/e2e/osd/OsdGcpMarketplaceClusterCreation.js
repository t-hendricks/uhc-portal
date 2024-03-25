import ClusterDetailsPage from '../../pageobjects/ClusterDetails.page';
import CreateOSDWizardPage from '../../pageobjects/CreateOSDWizard.page';

const clusterPropertiesFile = require('../../fixtures/osd/OsdGcpMarketplaceClusterProperties.json');
const QE_GCP = Cypress.env('QE_GCP_OSDCCSADMIN_JSON');

describe('OSD GCP Marketplace cluster creation tests', { tags: ['smoke'] }, () => {
  it('Launch OSD cluster wizard', () => {
    cy.getByTestId('create_cluster_btn').click();
    CreateOSDWizardPage.osdCreateClusterButton().click();
    CreateOSDWizardPage.isCreateOSDPage();
  });

  it('OSD wizard - Billing model and its definitions', () => {
    CreateOSDWizardPage.isBillingModelScreen();
    CreateOSDWizardPage.selectSubscriptionType(clusterPropertiesFile.SubscriptionType);
    CreateOSDWizardPage.selectMarketplaceSubscription(clusterPropertiesFile.Marketplace);
    CreateOSDWizardPage.selectInfrastructureType(clusterPropertiesFile.InfrastructureType);
    cy.get(CreateOSDWizardPage.primaryButton).click();
  });

  it('OSD wizard - Cluster Settings - Cloud provider definitions', () => {
    CreateOSDWizardPage.isCloudProviderSelectionScreen();
    CreateOSDWizardPage.awsCloudProviderCard().should('have.attr', 'aria-disabled', 'true');
    CreateOSDWizardPage.selectCloudProvider(clusterPropertiesFile.CloudProvider);
    CreateOSDWizardPage.acknowlegePrerequisitesCheckbox().check();
    CreateOSDWizardPage.uploadGCPServiceAccountJSON(JSON.stringify(QE_GCP));
    cy.get(CreateOSDWizardPage.primaryButton).click();
  });
  it('OSD wizard - Cluster Settings - Cluster details definitions', () => {
    CreateOSDWizardPage.isClusterDetailsScreen();
    cy.get(CreateOSDWizardPage.clusterNameInput).type(clusterPropertiesFile.ClusterName);
    CreateOSDWizardPage.hideClusterNameValidation();
    CreateOSDWizardPage.singleZoneAvilabilityRadio().check();
    CreateOSDWizardPage.multiZoneAvilabilityRadio().check();
    CreateOSDWizardPage.selectAvailabilityZone(clusterPropertiesFile.Availability);
    CreateOSDWizardPage.enableSecureBootSupportForSchieldedVMs(true);
    CreateOSDWizardPage.enableAdditionalEtcdEncryption(true, true);
    cy.get(CreateOSDWizardPage.primaryButton).click();
  });
  it('OSD wizard - Cluster Settings - Default machinepool definitions', () => {
    CreateOSDWizardPage.isMachinePoolScreen();
    CreateOSDWizardPage.selectComputeNodeType(clusterPropertiesFile.MachinePools[0].InstanceType);
    CreateOSDWizardPage.selectComputeNodeCount(clusterPropertiesFile.MachinePools[0].NodeCount);
    CreateOSDWizardPage.addNodeLabelLink().click();
    CreateOSDWizardPage.addNodeLabelKeyAndValue(
      clusterPropertiesFile.MachinePools[0].Labels[0].Key,
      clusterPropertiesFile.MachinePools[0].Labels[0].Value,
    );
    cy.get(CreateOSDWizardPage.primaryButton).click();
  });
  it('OSD wizard - Networking configuration - cluster privacy definitions', () => {
    CreateOSDWizardPage.isNetworkingScreen();
    CreateOSDWizardPage.selectClusterPrivacy('private');
    CreateOSDWizardPage.selectClusterPrivacy(clusterPropertiesFile.ClusterPrivacy);
    cy.get(CreateOSDWizardPage.primaryButton).click();
  });
  it('OSD wizard - Networking configuration - CIDR ranges definitions', () => {
    CreateOSDWizardPage.isCIDRScreen();
    CreateOSDWizardPage.useCIDRDefaultValues(false);
    CreateOSDWizardPage.useCIDRDefaultValues(true);
    CreateOSDWizardPage.machineCIDRInput().should('have.value', clusterPropertiesFile.MachineCIDR);
    CreateOSDWizardPage.serviceCIDRInput().should('have.value', clusterPropertiesFile.ServiceCIDR);
    CreateOSDWizardPage.podCIDRInput().should('have.value', clusterPropertiesFile.PodCIDR);
    CreateOSDWizardPage.hostPrefixInput().should('have.value', clusterPropertiesFile.HostPrefix);
    cy.get(CreateOSDWizardPage.primaryButton).click();
  });
  it('OSD wizard - Cluster updates definitions', () => {
    CreateOSDWizardPage.isUpdatesScreen();
    cy.get(CreateOSDWizardPage.primaryButton).click();
  });
  it('OSD wizard - Review and create page and its definitions', () => {
    CreateOSDWizardPage.isReviewScreen();
    CreateOSDWizardPage.subscriptionTypeValue().contains(clusterPropertiesFile.SubscriptionType);
    CreateOSDWizardPage.infrastructureTypeValue().contains(
      clusterPropertiesFile.InfrastructureType,
    );
    CreateOSDWizardPage.cloudProviderValue().contains(clusterPropertiesFile.CloudProvider);
    CreateOSDWizardPage.clusterNameValue().contains(clusterPropertiesFile.ClusterName);
    CreateOSDWizardPage.regionValue().contains(clusterPropertiesFile.Region.split(',')[0]);
    CreateOSDWizardPage.availabilityValue().contains(clusterPropertiesFile.Availability);
    CreateOSDWizardPage.securebootSupportForShieldedVMsValue().contains(
      clusterPropertiesFile.SecureBootSupportForShieldedVMs,
    );
    CreateOSDWizardPage.userWorkloadMonitoringValue().contains(
      clusterPropertiesFile.UserWorkloadMonitoring,
    );
    CreateOSDWizardPage.encryptVolumesWithCustomerkeysValue().contains(
      clusterPropertiesFile.EncryptVolumesWithCustomerKeys,
    );
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
    CreateOSDWizardPage.computeNodeCountValue().contains(
      `${clusterPropertiesFile.MachinePools[0].NodeCount} (× 3 zones = ${clusterPropertiesFile.MachinePools[0].NodeCount * 3} compute nodes)`,
    );
    CreateOSDWizardPage.nodeLabelsValue().contains(
      `${clusterPropertiesFile.MachinePools[0].Labels[0].Key} = ${clusterPropertiesFile.MachinePools[0].Labels[0].Value}`,
    );
    CreateOSDWizardPage.clusterPrivacyValue().contains(clusterPropertiesFile.ClusterPrivacy);
    CreateOSDWizardPage.installIntoExistingVpcValue().contains(
      clusterPropertiesFile.InstallIntoExistingVPC,
    );
    CreateOSDWizardPage.machineCIDRValue().contains(clusterPropertiesFile.MachineCIDR);
    CreateOSDWizardPage.serviceCIDRValue().contains(clusterPropertiesFile.ServiceCIDR);
    CreateOSDWizardPage.podCIDRValue().contains(clusterPropertiesFile.PodCIDR);
    CreateOSDWizardPage.hostPrefixValue().contains(clusterPropertiesFile.HostPrefix);
    CreateOSDWizardPage.applicationIngressValue().contains(
      clusterPropertiesFile.ApplicationIngress,
    );
    CreateOSDWizardPage.updateStratergyValue().contains(clusterPropertiesFile.UpdateStrategy);
    CreateOSDWizardPage.nodeDrainingValue().contains(clusterPropertiesFile.NodeDraining);
  });

  it('OSD wizard - Cluster submission & overview definitions', () => {
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
    ClusterDetailsPage.clusterAvailabilityLabelValue().contains(clusterPropertiesFile.Availability);
    ClusterDetailsPage.clusterMachineCIDRLabelValue().contains(clusterPropertiesFile.MachineCIDR);
    ClusterDetailsPage.clusterServiceCIDRLabelValue().contains(clusterPropertiesFile.ServiceCIDR);
    ClusterDetailsPage.clusterPodCIDRLabelValue().contains(clusterPropertiesFile.PodCIDR);
    ClusterDetailsPage.clusterHostPrefixLabelValue().contains(
      clusterPropertiesFile.HostPrefix.replace('/', ''),
    );
    ClusterDetailsPage.clusterSubscriptionBillingModelValue().contains(
      `On-demand via ${clusterPropertiesFile.Marketplace}`,
    );
    ClusterDetailsPage.clusterInfrastructureBillingModelValue().contains(
      clusterPropertiesFile.InfrastructureType,
    );
    ClusterDetailsPage.clusterSecureBootSupportForShieldedVMsValue().contains(
      clusterPropertiesFile.SecureBootSupportForShieldedVMs,
    );
  });
  it('Delete OSD cluster', () => {
    ClusterDetailsPage.actionsDropdownToggle().click();
    ClusterDetailsPage.deleteClusterDropdownItem().click();
    ClusterDetailsPage.deleteClusterNameInput().clear().type(clusterPropertiesFile.ClusterName);
    ClusterDetailsPage.deleteClusterConfirm().click();
    ClusterDetailsPage.waitForDeleteClusterActionComplete();
  });
});
