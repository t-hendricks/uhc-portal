import Login from '../../pageobjects/login.page';
import ClusterListPage from '../../pageobjects/ClusterList.page';
import ClusterDetails from '../../pageobjects/ClusterDetails.page';

const clusterPropertiesFile = require('../../fixtures/rosa/RosaClusterDefaultPublicSingleZoneProperties.json');

describe(
  'ROSA Cluster properties - Default Public single zone cluster',
  { tags: ['day2', 'rosa', 'default', 'singlezone'] },
  () => {
    before(() => {
      cy.visit('/');
      Login.isLoginPageUrl();
      Login.login();

      ClusterListPage.isClusterListUrl();
      ClusterListPage.waitForDataReady();
      cy.getByTestId('create_cluster_btn').should('be.visible');
      ClusterListPage.isClusterListScreen();
      ClusterListPage.filterTxtField().should('be.visible').click();
      ClusterListPage.filterTxtField().clear().type(clusterPropertiesFile.ClusterName);
      ClusterListPage.waitForDataReady();
      ClusterListPage.openClusterDefinition(clusterPropertiesFile.ClusterName);
    });

    it('Cluster details : Overview tab', () => {
      cy.get('h1.cl-details-page-title', { timeout: 20000 }).should(
        'have.text',
        clusterPropertiesFile.ClusterName,
      );
      ClusterDetails.isClusterDetailsPage(clusterPropertiesFile.ClusterName);
      ClusterDetails.overviewTab().click();
      ClusterDetails.clusterTypeLabelValue().contains(clusterPropertiesFile.Type);
      ClusterDetails.clusterAvailabilityLabelValue().contains(clusterPropertiesFile.Availability);
      ClusterDetails.clusterRegionLabelValue().contains(clusterPropertiesFile.Region.split(',')[0]);
      ClusterDetails.clusterInfrastructureAWSaccountLabelValue().contains(
        clusterPropertiesFile.InfrastructureAWSaccount,
      );
      ClusterDetails.clusterAdditionalEncryptionStatus().contains(
        clusterPropertiesFile.AdditionalEncryption,
      );
      ClusterDetails.clusterIMDSValue().contains(clusterPropertiesFile.InstanceMetadataService);
      ClusterDetails.clusterAutoScalingStatus().contains(clusterPropertiesFile.ClusterAutoscaling);
      ClusterDetails.clusterMachineCIDRLabelValue().contains(clusterPropertiesFile.MachineCIDR);
      ClusterDetails.clusterServiceCIDRLabelValue().contains(clusterPropertiesFile.ServiceCIDR);
      ClusterDetails.clusterPodCIDRLabelValue().contains(clusterPropertiesFile.PodCIDR);
      ClusterDetails.clusterHostPrefixLabelValue().contains(
        clusterPropertiesFile.HostPrefix.replace('/', ''),
      );
    });

    it('Cluster details : Machine pools tab', () => {
      ClusterDetails.machinePoolsTab().click();
      ClusterDetails.getMachinePoolName(1).contains(clusterPropertiesFile.MachinePools[0].Name);
      ClusterDetails.getMachinePoolInstanceType(1).contains(
        clusterPropertiesFile.MachinePools[0].InstanceType,
      );
      ClusterDetails.getMachinePoolAvailabilityZones(1).contains(
        clusterPropertiesFile.MachinePools[0].AvailabilityZones,
      );
      ClusterDetails.getMachinePoolNodeCount(1).contains(
        clusterPropertiesFile.MachinePools[0].NodeCount,
      );
      ClusterDetails.getMachinePoolNodeAutoscaling(1).contains(
        clusterPropertiesFile.MachinePools[0].Autoscaling,
      );
    });
    it('Cluster details : Networking tab', () => {
      ClusterDetails.networkingTab().click();
    });

    it('Cluster details : Access control tab', () => {
      ClusterDetails.accessControlTab().click();
    });
  },
);
