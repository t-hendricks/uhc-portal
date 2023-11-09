import semver from 'semver';
import { clusterService } from '../../../../../services';
import { isControlPlaneValidForMachinePool } from './UpdateMachinePools/updateMachinePoolsHelpers';

import {
  GET_MACHINE_POOLS,
  DELETE_MACHINE_POOL,
  CLEAR_GET_MACHINE_POOLS_RESPONSE,
  CLEAR_DELETE_MACHINE_POOL_RESPONSE,
} from './machinePoolsActionConstants';

const getNodePoolWithUpgradePolicies = async (
  clusterID,
  clusterVersion,
  useMachinePoolPolicies,
) => {
  const nodePools = await clusterService.getNodePools(clusterID);

  const promiseArray = nodePools.data.items.map(async (pool) => {
    if (
      !clusterVersion ||
      !pool.version ||
      !useMachinePoolPolicies ||
      !semver.gt(semver.coerce(clusterVersion), semver.coerce(pool.version.id)) ||
      !isControlPlaneValidForMachinePool(pool, clusterVersion)
    ) {
      return pool;
    }

    try {
      const poolUpgradePolicies = await clusterService.getNodePoolUpgradePolicies(
        clusterID,
        pool.id,
      );
      return { ...pool, upgradePolicies: poolUpgradePolicies.data };
    } catch (errorResponse) {
      return {
        ...pool,
        upgradePolicies: {
          errorMessage:
            errorResponse.response?.data?.reason ||
            errorResponse.message ||
            'There was an error fetching upgrade policies for this machine pool.',
        },
        items: [],
      };
    }
  });

  const result = await Promise.allSettled(promiseArray);

  const nodePoolsWithUpgradePolicies = result.map((pool) => pool.value);

  const newResponse = {
    ...nodePools,
    data: { ...nodePools.data, items: nodePoolsWithUpgradePolicies },
  };
  return newResponse;
};

const getMachineOrNodePools =
  (clusterID, isHypershiftCluster, clusterVersion, useMachinePoolPolicies) => (dispatch) =>
    dispatch({
      type: GET_MACHINE_POOLS,
      payload: isHypershiftCluster
        ? getNodePoolWithUpgradePolicies(clusterID, clusterVersion, useMachinePoolPolicies)
        : clusterService.getMachinePools(clusterID),
    });

const deleteMachinePool = (clusterID, machinePoolID, isHypershiftCluster) => (dispatch) =>
  dispatch({
    type: DELETE_MACHINE_POOL,
    payload: isHypershiftCluster
      ? clusterService.deleteNodePool(clusterID, machinePoolID)
      : clusterService.deleteMachinePool(clusterID, machinePoolID),
  });

const clearGetMachinePoolsResponse = () => (dispatch) =>
  dispatch({
    type: CLEAR_GET_MACHINE_POOLS_RESPONSE,
  });

const clearDeleteMachinePoolResponse = () => (dispatch) =>
  dispatch({
    type: CLEAR_DELETE_MACHINE_POOL_RESPONSE,
  });

export {
  getMachineOrNodePools,
  deleteMachinePool,
  clearGetMachinePoolsResponse,
  clearDeleteMachinePoolResponse,
};
