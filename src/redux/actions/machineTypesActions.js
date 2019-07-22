
import { machineTypesConstants } from '../constants';
import { clusterService } from '../../services';

const getMachineTypes = () => dispatch => dispatch({
  type: machineTypesConstants.GET_MACHINE_TYPES,
  payload: clusterService.getMachineTypes,
});

const machineTypesActions = {
  getMachineTypes,
};

export { machineTypesActions, getMachineTypes };
