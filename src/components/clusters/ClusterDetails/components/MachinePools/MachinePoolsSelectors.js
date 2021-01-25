import { availableNodesFromQuota } from '../../../common/quotaSelectors';
import sortMachineTypes from '../../../CreateOSDPage/CreateOSDForm/FormSections/ScaleSection/MachineTypeSelection/sortMachineTypes';

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

export default hasMachinePoolsQuotaSelector;
