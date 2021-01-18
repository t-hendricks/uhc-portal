import get from 'lodash/get';

import sortMachineTypes from '../../../CreateOSDPage/CreateOSDForm/FormSections/ScaleSection/MachineTypeSelection/sortMachineTypes';
import { availableNodesFromQuota } from '../../../common/quotaSelectors';
import { normalizedProducts } from '../../../../../common/subscriptionTypes';

const hasMachinePoolsQuotaSelector = (state) => {
  const { organization } = state.userProfile;

  if (!organization?.fulfilled) {
    return false;
  }

  const { cluster } = state.clusters.details;
  const cloudProviderID = cluster.cloud_provider?.id;

  const hasNodesQuotaForType = (machineTypeID) => {
    const machineTypesByID = state.machineTypes.typesByID;

    const machineType = machineTypesByID[machineTypeID];

    if (!machineType) {
      return false;
    }

    const resourceName = machineType.resource_name;

    const quotaParams = {
      product: cluster?.subscription?.plan?.id,
      cloudProviderID,
      isBYOC: !!cluster?.ccs?.enabled,
      isMultiAz: cluster.multi_az,
      resourceName,
    };

    const nodesAvailable = availableNodesFromQuota(organization?.quotaList, quotaParams);

    return nodesAvailable >= 1;
  };

  const sortedMachineTypes = sortMachineTypes(state, cloudProviderID);

  return sortedMachineTypes.some(type => hasNodesQuotaForType(type.id));
};

const hasOrgLevelAutoscaleCapability = (state) => {
  const capabilites = get(state, 'userProfile.organization.details.capabilities', []);
  const autoScaleClusters = capabilites.find(capability => capability.name === 'capability.organization.autoscale_clusters');

  return !!(autoScaleClusters && autoScaleClusters.value === 'true');
};

const canAutoScaleSelector = (state, product) => [normalizedProducts.MOA, normalizedProducts.ROSA]
  .includes(product) || hasOrgLevelAutoscaleCapability(state);

export { hasMachinePoolsQuotaSelector, canAutoScaleSelector };
