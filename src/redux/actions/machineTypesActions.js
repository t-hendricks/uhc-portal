import { machineTypesConstants } from '../constants';
import { clusterService } from '../../services';

// Group machine types by cloud provider
const groupByCloudProvider = (machineTypes) => {
  const byProvider = {};
  machineTypes.forEach((machineType) => {
    const providerID = machineType.cloud_provider.id;
    if (!byProvider[providerID]) {
      byProvider[providerID] = [machineType];
    } else {
      byProvider[providerID].push(machineType);
    }
  });
  return byProvider;
};

const getMachineTypes = () => (dispatch) =>
  dispatch({
    type: machineTypesConstants.GET_MACHINE_TYPES,
    payload: clusterService
      .getMachineTypes()
      .then((response) => groupByCloudProvider(response.data.items)),
  });

const machineTypesActions = {
  getMachineTypes,
  groupByCloudProvider,
};

export { machineTypesActions, getMachineTypes, groupByCloudProvider };
