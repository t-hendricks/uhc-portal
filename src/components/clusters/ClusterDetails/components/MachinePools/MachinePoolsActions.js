import { clusterService } from '../../../../../services';

const GET_MACHINE_POOLS = 'GET_MACHINE_POOLS';
const DELETE_MACHINE_POOL = 'DELETE_MACHINE_POOL';
const CLEAR_GET_MACHINE_POOLS_RESPONSE = 'CLEAR_GET_MACHINE_POOLS_RESPONSE';
const CLEAR_DELETE_MACHINE_POOL_RESPONSE = 'CLEAR_DELETE_MACHINE_POOL_RESPONSE';

const getMachineOrNodePools = (clusterID, isHypershiftCluster) => (dispatch) =>
  dispatch({
    type: GET_MACHINE_POOLS,
    payload: isHypershiftCluster
      ? clusterService.getNodePools(clusterID)
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
  GET_MACHINE_POOLS,
  DELETE_MACHINE_POOL,
  CLEAR_GET_MACHINE_POOLS_RESPONSE,
  CLEAR_DELETE_MACHINE_POOL_RESPONSE,
  getMachineOrNodePools,
  deleteMachinePool,
  clearGetMachinePoolsResponse,
  clearDeleteMachinePoolResponse,
};
