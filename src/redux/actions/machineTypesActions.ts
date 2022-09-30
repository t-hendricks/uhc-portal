import { action, ActionType } from 'typesafe-actions';
import { machineTypesConstants } from '../constants';
import { clusterService } from '../../services';
import type { MachineType } from '../../types/clusters_mgmt.v1';
import type { AppThunk } from '../types';

// Group machine types by cloud provider
const groupByCloudProvider = (machineTypes?: MachineType[]): { [id: string]: MachineType[] } => {
  const byProvider: { [id: string]: MachineType[] } = {};
  machineTypes?.forEach((machineType) => {
    const providerID = machineType.cloud_provider?.id;
    if (providerID) {
      if (!byProvider[providerID]) {
        byProvider[providerID] = [machineType];
      } else {
        byProvider[providerID].push(machineType);
      }
    }
  });
  return byProvider;
};

const getMachineTypesAction = () =>
  action(
    machineTypesConstants.GET_MACHINE_TYPES,
    clusterService.getMachineTypes().then((response) => groupByCloudProvider(response.data.items)),
  );

const getMachineTypes = (): AppThunk => (dispatch) =>
  dispatch(
    action(
      machineTypesConstants.GET_MACHINE_TYPES,
      clusterService
        .getMachineTypes()
        .then((response) => groupByCloudProvider(response.data.items)),
    ),
  );

type MachineTypesAction = ActionType<typeof getMachineTypesAction>;

const machineTypesActions = {
  getMachineTypes,
  groupByCloudProvider,
};

export { machineTypesActions, getMachineTypes, groupByCloudProvider, MachineTypesAction };
