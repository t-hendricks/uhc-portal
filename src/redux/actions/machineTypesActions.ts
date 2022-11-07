import { action, ActionType } from 'typesafe-actions';
import { machineTypesConstants } from '../constants';
import { clusterService } from '../../services';
import type { MachineType } from '../../types/clusters_mgmt.v1';

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

const getMachineTypes = () =>
  action(
    machineTypesConstants.GET_MACHINE_TYPES,
    clusterService.getMachineTypes().then((response) => groupByCloudProvider(response.data.items)),
  );

const machineTypesActions = {
  getMachineTypes,
};

type MachineTypesAction = ActionType<typeof machineTypesActions>;

export { machineTypesActions, getMachineTypes, groupByCloudProvider, MachineTypesAction };
