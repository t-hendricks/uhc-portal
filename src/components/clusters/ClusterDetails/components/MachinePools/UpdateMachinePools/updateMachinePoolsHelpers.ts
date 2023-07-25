import { useSelector } from 'react-redux';
import semver from 'semver';
import { NodePool } from '~/types/clusters_mgmt.v1/models/NodePool';
import clusterService from '~/services/clusterService';
import { GlobalState } from '~/redux/store';
import {
  hasAvailableUpdatesSelector,
  updateStartedSelector,
} from '~/components/clusters/common/Upgrades/upgradeHelpers';
import { isHypershiftCluster } from '../../../clusterDetailsHelper';

export const controlPlaneIdSelector = (state: GlobalState) =>
  state.clusters.details.cluster.id || '';

export const controlPlaneVersionSelector = (state: GlobalState) =>
  state.clusters.details.cluster?.version?.id;

export const displayControlPlaneVersion = (controlPlaneVersion: string | undefined) =>
  semver.coerce(controlPlaneVersion)?.version;

export const isControlPlaneUpToDate = (state: GlobalState) => {
  const availableControlPlaneUpgrades = hasAvailableUpdatesSelector(state);
  const controlPlaneUpgradeStarted = updateStartedSelector(state);
  const controlPlaneVersion = controlPlaneVersionSelector(state);
  const machinePools = state.machinePools?.getMachinePools;
  const isHypershift = isHypershiftCluster(state.clusters.details.cluster);

  return (
    !availableControlPlaneUpgrades &&
    !controlPlaneUpgradeStarted &&
    machinePools.data &&
    machinePools.fulfilled &&
    !machinePools.error &&
    controlPlaneVersion &&
    isHypershift
  );
};

export const useControlPlaneUpToDate = () => useSelector(isControlPlaneUpToDate);

export const compareIsMachinePoolBehindControlPlane = (
  controlPlaneVersion?: string,
  machinePoolVersion?: string,
) => {
  if (!controlPlaneVersion || !machinePoolVersion) {
    return false;
  }
  // @ts-ignore  Error due to an issue with semver
  return semver.gt(semver.coerce(controlPlaneVersion), semver.coerce(machinePoolVersion));
};

export const isMachinePoolBehindControlPlane = (state: GlobalState, machinePool: NodePool) => {
  // @ts-ignore pool.version not picked up by running yarn gen-type
  if (!machinePool || !machinePool.version) {
    return false;
  }
  const controlPlaneVersion = controlPlaneVersionSelector(state);

  // @ts-ignore pool.version not picked up by running yarn gen-types
  return compareIsMachinePoolBehindControlPlane(controlPlaneVersion, machinePool.version.id);
};

export const useMachinePoolBehindControlPlane = (machinePool: NodePool) =>
  useSelector((state: GlobalState) => isMachinePoolBehindControlPlane(state, machinePool));

export const updateAllMachinePools = async (
  machinePools: NodePool[],
  clusterId: string,
  toBeVersion: string,
) => {
  const errors: string[] = [];

  // In theory, this should never be called because we check for a version before calling this method
  if (!toBeVersion || toBeVersion === '') {
    return ['Machine pools could not be updated because control plane version is unknown'];
  }

  const promisesArray = machinePools.map((pool: NodePool) =>
    // @ts-ignore cluster id is incorrectly identified as optional and changes are not picked up by running yarn gen-types
    clusterService.patchNodePool(clusterId, pool.id, {
      version: { id: toBeVersion },
    }),
  );

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
