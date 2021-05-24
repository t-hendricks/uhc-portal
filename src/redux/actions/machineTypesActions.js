import { machineTypesConstants } from '../constants';
import { clusterService } from '../../services';

// Determine resource_name to check quota
const getResourceName = (machineType) => {
  // return generic name if defined for machine type
  if (machineType.generic_name) {
    return machineType.generic_name;
  }
  // elese compute resource name from intance size and category
  let category = '';
  switch (machineType.category) {
    case 'general_purpose':
      category = 'gp';
      break;
    case 'compute_optimized':
      category = 'cpu';
      break;
    case 'memory_optimized':
      category = 'mem';
      break;
    case 'accelerated_computing':
      category = 'gpu';
      break;
    default:
      break;
  }
  return `${category}.${machineType.size}`;
};

// Group machine types by cloud provider
const groupByCloudProvider = (machineTypes) => {
  const byProvider = {};
  machineTypes.forEach((machineType) => {
    // eslint-disable-next-line no-param-reassign
    machineType.resource_name = getResourceName(machineType);
    const providerID = machineType.cloud_provider.id;
    if (!byProvider[providerID]) {
      byProvider[providerID] = [machineType];
    } else {
      byProvider[providerID].push(machineType);
    }
  });
  return byProvider;
};

const getMachineTypes = () => dispatch => dispatch({
  type: machineTypesConstants.GET_MACHINE_TYPES,
  payload: clusterService.getMachineTypes()
    .then(response => groupByCloudProvider(response.data.items)),
});

const machineTypesActions = {
  getMachineTypes,
  getResourceName,
  groupByCloudProvider,
};

export {
  machineTypesActions,
  getMachineTypes,
  getResourceName,
  groupByCloudProvider,
};
