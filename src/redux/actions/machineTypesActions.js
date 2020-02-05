
import { machineTypesConstants } from '../constants';
import { clusterService } from '../../services';

const getMachineTypes = () => dispatch => dispatch({
  type: machineTypesConstants.GET_MACHINE_TYPES,
  payload: clusterService.getMachineTypes().then((response) => {
    const byProvider = {};
    response.data.items.forEach((machineType) => {
      const providerID = machineType.cloud_provider.id;
      if (!byProvider[providerID]) {
        byProvider[providerID] = [machineType];
      } else {
        byProvider[providerID].push(machineType);
      }
    });
    return byProvider;
  }),
});

const machineTypesActions = {
  getMachineTypes,
};

export { machineTypesActions, getMachineTypes };
