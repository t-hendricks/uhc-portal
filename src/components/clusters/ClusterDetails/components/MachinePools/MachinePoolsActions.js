import { clusterService } from '../../../../../services';
import { normalizeMachinePool } from './machinePoolsHelper';

const GET_MACHINE_POOLS = 'GET_MACHINE_POOLS';
const ADD_MACHINE_POOL = 'ADD_MACHINE_POOL';
const SCALE_MACHINE_POOL = 'SCALE_MACHINE_POOL';
const PATCH_NODE_POOL = 'PATCH_NODE_POOL';
const DELETE_MACHINE_POOL = 'DELETE_MACHINE_POOL';
const CLEAR_GET_MACHINE_POOLS_RESPONSE = 'CLEAR_GET_MACHINE_POOLS_RESPONSE';
const CLEAR_ADD_MACHINE_POOL_RESPONSE = 'CLEAR_ADD_MACHINE_POOL_RESPONSE';
const CLEAR_SCALE_MACHINE_POOL_RESPONSE = 'CLEAR_SCALE_MACHINE_POOL_RESPONSE';
const CLEAR_DELETE_MACHINE_POOL_RESPONSE = 'CLEAR_DELETE_MACHINE_POOL_RESPONSE';

const getMachineOrNodePools = (clusterID, isHypershiftCluster) => (dispatch) =>
  dispatch({
    type: GET_MACHINE_POOLS,
    payload: isHypershiftCluster
      ? clusterService.getNodePools(clusterID)
      : clusterService.getMachinePools(clusterID),
  });

/**
 * Creates a machine or node pool
 * @param {string} clusterID - Cluster ID
 * @param {MachinePool | NodePool} params - see src/types/clusters_mgmt.v1/models
 * @param {boolean} - isHypershiftCluster  -  is this a Hypershift control plane cluster?
 */
const addMachinePoolOrNodePool = (clusterID, params, isHypershiftCluster) => (dispatch) =>
  dispatch({
    type: ADD_MACHINE_POOL,
    payload: isHypershiftCluster
      ? clusterService.addNodePool(clusterID, params)
      : clusterService.addMachinePool(clusterID, params),
  });

/**
 * Patches a given Machine Pool/Node Pool for a cluster
 * @constructor
 * @param {string} clusterID - Cluster ID
 * @param {string} machinePoolID - ID for the machine pool or node pool if hosted (hypershift)
 * @param {MachinePool | NodePool} - data is either hosted (will be normalized) or standard
 */
const patchMachinePoolOrNodePool =
  (clusterID, machinePoolID, params, isHypershiftCluster = false) =>
  (dispatch) =>
    isHypershiftCluster
      ? dispatch({
          type: PATCH_NODE_POOL,
          payload: clusterService.patchNodePool(
            clusterID,
            machinePoolID,
            normalizeMachinePool(params),
          ),
        })
      : dispatch({
          type: SCALE_MACHINE_POOL,
          payload: clusterService.scaleMachinePool(clusterID, machinePoolID, params),
        });

const deleteMachinePool = (clusterID, machinePoolID, isHypershiftCluster) => (dispatch) =>
  dispatch({
    type: DELETE_MACHINE_POOL,
    payload: isHypershiftCluster
      ? clusterService.deleteNodePool(clusterID, machinePoolID)
      : clusterService.deleteMachinePool(clusterID, machinePoolID),
  });

const clearAddMachinePoolResponse = () => (dispatch) =>
  dispatch({
    type: CLEAR_ADD_MACHINE_POOL_RESPONSE,
  });

const clearGetMachinePoolsResponse = () => (dispatch) =>
  dispatch({
    type: CLEAR_GET_MACHINE_POOLS_RESPONSE,
  });

const clearScaleMachinePoolResponse = () => (dispatch) =>
  dispatch({
    type: CLEAR_SCALE_MACHINE_POOL_RESPONSE,
  });

const clearDeleteMachinePoolResponse = () => (dispatch) =>
  dispatch({
    type: CLEAR_DELETE_MACHINE_POOL_RESPONSE,
  });

export {
  GET_MACHINE_POOLS,
  ADD_MACHINE_POOL,
  SCALE_MACHINE_POOL,
  PATCH_NODE_POOL,
  DELETE_MACHINE_POOL,
  CLEAR_ADD_MACHINE_POOL_RESPONSE,
  CLEAR_SCALE_MACHINE_POOL_RESPONSE,
  CLEAR_GET_MACHINE_POOLS_RESPONSE,
  CLEAR_DELETE_MACHINE_POOL_RESPONSE,
  getMachineOrNodePools,
  addMachinePoolOrNodePool,
  patchMachinePoolOrNodePool,
  deleteMachinePool,
  clearAddMachinePoolResponse,
  clearGetMachinePoolsResponse,
  clearScaleMachinePoolResponse,
  clearDeleteMachinePoolResponse,
};
