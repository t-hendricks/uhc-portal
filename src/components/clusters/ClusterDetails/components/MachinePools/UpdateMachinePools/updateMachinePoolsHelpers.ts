import { useSelector } from 'react-redux';
import semver from 'semver';
import { NodePool } from '~/types/clusters_mgmt.v1/models/NodePool';
import clusterService, { postNodePoolUpgradeSchedule } from '~/services/clusterService';
import { GlobalState } from '~/redux/store';
import { updateStartedSelector } from '~/components/clusters/common/Upgrades/upgradeHelpers';
import { isHypershiftCluster } from '~/components/clusters/common/clusterStates';
import { ScheduleType, UpgradeType } from '~/types/clusters_mgmt.v1';
import { NodePoolWithUpgradePolicies } from '../machinePoolCustomTypes';

export const controlPlaneIdSelector = (state: GlobalState) =>
  state.clusters.details.cluster.id || '';

export const controlPlaneVersionSelector = (state: GlobalState) =>
  state.clusters.details.cluster?.version?.id || '';

export const displayControlPlaneVersion = (controlPlaneVersion: string | undefined) =>
  semver.coerce(controlPlaneVersion)?.version;

export const isHCPControlPlaneUpdating = (state: GlobalState) => {
  const controlPlaneUpgradeStarted = updateStartedSelector(state);
  const controlPlaneVersion = controlPlaneVersionSelector(state);
  const machinePools = state.machinePools?.getMachinePools;
  const isHypershift = isHypershiftCluster(state.clusters.details.cluster);

  return (
    !isHypershift ||
    !controlPlaneVersion ||
    controlPlaneUpgradeStarted ||
    !machinePools.data ||
    !machinePools.fulfilled ||
    machinePools.error
  );
};

export const useHCPControlPlaneUpdating = () => useSelector(isHCPControlPlaneUpdating);

export const compareIsMachinePoolBehindControlPlane = (
  controlPlaneVersion?: string,
  machinePoolVersion?: string,
) => {
  if (!controlPlaneVersion || !machinePoolVersion) {
    return false;
  }

  return semver.gt(
    semver.coerce(controlPlaneVersion) || '',
    semver.coerce(machinePoolVersion) || '',
  );
};

export const isMachinePoolBehindControlPlane = (
  state: GlobalState,
  machinePool: NodePoolWithUpgradePolicies,
) => {
  if (!machinePool || !machinePool.version?.id) {
    return false;
  }
  const controlPlaneVersion = controlPlaneVersionSelector(state);

  return compareIsMachinePoolBehindControlPlane(controlPlaneVersion, machinePool.version.id);
};

export const useMachinePoolBehindControlPlane = (machinePool: NodePoolWithUpgradePolicies) =>
  useSelector((state: GlobalState) => isMachinePoolBehindControlPlane(state, machinePool));

export const updateAllMachinePools = async (
  machinePools: NodePool[],
  clusterId: string,
  toBeVersion: string,
  useNodePoolUpgradePolicies: boolean,
) => {
  // NOTE this results of this helper does NOT put the information into Redux
  // because it isn't needed - we just need to know if the update policy was created

  const errors: string[] = [];

  // In theory, this should never be called because we check for a version before calling this method
  if (!toBeVersion || toBeVersion === '') {
    return ['Machine pools could not be updated because control plane version is unknown'];
  }

  const promisesArray = machinePools.map((pool: NodePool) => {
    if (!useNodePoolUpgradePolicies) {
      return clusterService.patchNodePool(clusterId, pool.id || '', {
        version: { id: toBeVersion },
      });
    }

    const MINUTES_IN_MS = 1000 * 60;

    const schedule = {
      schedule_type: ScheduleType.MANUAL,
      next_run: new Date(new Date().getTime() + 6 * MINUTES_IN_MS).toISOString(),
      version: semver.coerce(toBeVersion)?.version,
      node_pool_id: pool.id,
      upgrade_type: UpgradeType.NODE_POOL,
    };

    return postNodePoolUpgradeSchedule(clusterId, pool.id || '', schedule);
  });

  // @ts-ignore  error due to using an older compiler
  const results = await Promise.allSettled(promisesArray);

  interface PromiseFulfilledResult<T> {
    status: 'fulfilled';
    value: T;
  }
  interface PromiseRejectedResult {
    status: 'rejected';
    reason: any;
  }

  type PromiseSettledResult<T> = PromiseFulfilledResult<T> | PromiseRejectedResult;

  results.forEach((result: PromiseSettledResult<string>) => {
    if (result.status === 'rejected') {
      errors.push(`${result.reason.response.data.code} - ${result.reason.response.data.reason}`);
    }
  });
  return errors;
};

export const isControlPlaneValidForMachinePool = (
  machinePool: NodePool,
  controlPlaneVersion: string,
) => {
  const availableVersions = machinePool?.version?.available_upgrades;
  if (!controlPlaneVersion || !availableVersions) {
    return true; // we are returning true so the API can verify
  }

  return availableVersions.some((version: string) =>
    semver.eq(semver.coerce(controlPlaneVersion)?.version || '', version),
  );
};

export const useIsControlPlaneValidForMachinePool = (machinePool: NodePool): boolean => {
  const controlPlaneVersion = useSelector(controlPlaneVersionSelector);
  return isControlPlaneValidForMachinePool(machinePool, controlPlaneVersion || '');
};

export const isMachinePoolUpgrading = (machinePool: NodePoolWithUpgradePolicies) =>
  !!machinePool.upgradePolicies?.items?.length;

export const isMachinePoolScheduleError = (machinePool: NodePoolWithUpgradePolicies) =>
  !!machinePool.upgradePolicies?.errorMessage;
