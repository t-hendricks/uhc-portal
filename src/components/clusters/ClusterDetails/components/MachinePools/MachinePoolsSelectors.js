import get from 'lodash/get';

import sortMachineTypes from '../../../CreateOSDPage/CreateOSDForm/FormSections/ScaleSection/MachineTypeSelection/sortMachineTypes';
import { availableNodesFromQuota } from '../../../common/quotaSelectors';
import { normalizedProducts, billingModels } from '../../../../../common/subscriptionTypes';

const hasMachinePoolsQuotaSelector = (state) => {
  const { organization } = state.userProfile;

  if (!organization?.fulfilled) {
    return false;
  }

  const { cluster } = state.clusters.details;
  const cloudProviderID = cluster.cloud_provider?.id;
  const billingModel = get(cluster, 'billing_model', billingModels.STANDARD);

  const hasNodesQuotaForType = (machineTypeID) => {
    const machineTypesByID = state.machineTypes.typesByID;

    const machineType = machineTypesByID[machineTypeID];

    if (!machineType) {
      return false;
    }

    const resourceName = machineType.resource_name;

    const quotaParams = {
      product: cluster?.subscription?.plan?.type,
      cloudProviderID,
      isBYOC: !!cluster?.ccs?.enabled,
      isMultiAz: cluster.multi_az,
      resourceName,
      billingModel,
    };

    const nodesAvailable = availableNodesFromQuota(organization?.quotaList, quotaParams);

    return nodesAvailable >= 1;
  };

  const sortedMachineTypes = sortMachineTypes(state, cloudProviderID);

  return sortedMachineTypes.some(type => hasNodesQuotaForType(type.id));
};

const hasOrgLevelAutoscaleCapability = (state) => {
  const capabilites = get(state, 'userProfile.organization.details.capabilities', []);
  const autoScaleClusters = capabilites.find(capability => capability.name === 'capability.cluster.autoscale_clusters');

  return !!(autoScaleClusters && autoScaleClusters.value === 'true');
};

const hasClusterLevelAutoscaleCapability = (state) => {
  const cluster = get(state, 'clusters.details.cluster');
  if (!cluster) {
    return false;
  }
  const subCapabilities = get(cluster, 'subscription.capabilities', []);
  const autoScaleClusters = subCapabilities.find(capability => capability.name === 'capability.cluster.autoscale_clusters');

  return !!(autoScaleClusters && autoScaleClusters.value === 'true');
};

// on the OSD creation page don't check cluster level capability for autoscaling
const canAutoScaleOnCreateSelector = (state, product) => product === normalizedProducts.ROSA
    || (product === normalizedProducts.OSD && hasOrgLevelAutoscaleCapability(state));

const canAutoScaleSelector = (state, product) => product === normalizedProducts.ROSA
    || (product === normalizedProducts.OSD && hasClusterLevelAutoscaleCapability(state))
    || (product === normalizedProducts.OSD && hasOrgLevelAutoscaleCapability(state));

const canUseSpotInstances = (state, product) => product === normalizedProducts.ROSA
  || (product === normalizedProducts.OSD && state.clusters.details?.cluster?.ccs?.enabled);

export {
  hasMachinePoolsQuotaSelector,
  hasOrgLevelAutoscaleCapability,
  canAutoScaleOnCreateSelector,
  canAutoScaleSelector,
  canUseSpotInstances,
};
