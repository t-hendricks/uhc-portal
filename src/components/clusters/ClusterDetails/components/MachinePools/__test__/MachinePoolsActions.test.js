import {
  getMachineOrNodePools,
  deleteMachinePool,
  clearGetMachinePoolsResponse,
} from '../MachinePoolsActions';

import {
  GET_MACHINE_POOLS,
  DELETE_MACHINE_POOL,
  CLEAR_GET_MACHINE_POOLS_RESPONSE,
} from '../machinePoolsActionConstants';
import { clusterService } from '../../../../../../services';

jest.mock('../../../../../../services/clusterService');

describe('MachinePools actions', () => {
  let mockDispatch;
  beforeEach(() => {
    mockDispatch = jest.fn();
  });

  describe('getMachinePools', () => {
    it('dispatches successfully', () => {
      getMachineOrNodePools('mock-cluster-id', false)(mockDispatch);
      expect(mockDispatch).toBeCalledWith({
        payload: expect.anything(),
        type: GET_MACHINE_POOLS,
      });
    });

    it('calls clusterService.getMachinePools', () => {
      getMachineOrNodePools('mock-cluster-id', false)(mockDispatch);
      expect(clusterService.getMachinePools).toBeCalledWith('mock-cluster-id');
    });

    it('calls clusterService.getNodePools', () => {
      getMachineOrNodePools('mock-cluster-id', true)(mockDispatch);
      expect(clusterService.getNodePools).toBeCalledWith('mock-cluster-id');
    });
  });

  describe('deleteMachinePool', () => {
    it('dispatches successfully', () => {
      deleteMachinePool('mock-cluster-id', 'mock-mp-id')(mockDispatch);
      expect(mockDispatch).toBeCalledWith({
        payload: expect.anything(),
        type: DELETE_MACHINE_POOL,
      });
    });

    it('calls clusterService.deleteMachinePool', () => {
      deleteMachinePool('mock-cluster-id', 'mock-mp-id')(mockDispatch);
      expect(clusterService.deleteMachinePool).toBeCalledWith('mock-cluster-id', 'mock-mp-id');
    });
  });

  it('calls clusterService.deleteMachinePool', () => {
    deleteMachinePool('mock-cluster-id', 'mock-mp-id')(mockDispatch);
    expect(clusterService.deleteMachinePool).toBeCalledWith('mock-cluster-id', 'mock-mp-id');
  });

  describe('clearGetMachinePoolsResponse', () => {
    it('dispatches successfully', () => {
      clearGetMachinePoolsResponse()(mockDispatch);
      expect(mockDispatch).toBeCalledWith({
        type: CLEAR_GET_MACHINE_POOLS_RESPONSE,
      });
    });
  });
});
