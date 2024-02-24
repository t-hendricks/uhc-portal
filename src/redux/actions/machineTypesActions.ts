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

const getMachineTypesByRegion = (
  accessKeyId: string,
  accountId: string,
  secretAccessKey: string,
  region: string,
) =>
  action(
    machineTypesConstants.GET_MACHINE_TYPES_BY_REGION,
    clusterService
      .getMachineTypesByRegion(accessKeyId, accountId, secretAccessKey, region)
      .then((response) => groupByCloudProvider(response.data.items)),
    { region: { id: region } },
  );

const clearMachineTypesByRegion = () => action(machineTypesConstants.RESET_INITIAL_STATE);

const machineTypesByRegionActions = {
  getMachineTypesByRegion,
  clearMachineTypesByRegion,
};

type MachineTypesAction = ActionType<typeof machineTypesActions>;
type MachineTypesByRegionAction = ActionType<typeof machineTypesByRegionActions>;

export {
  machineTypesActions,
  machineTypesByRegionActions,
  getMachineTypesByRegion,
  getMachineTypes,
  clearMachineTypesByRegion,
  groupByCloudProvider,
  MachineTypesAction,
  MachineTypesByRegionAction,
};
