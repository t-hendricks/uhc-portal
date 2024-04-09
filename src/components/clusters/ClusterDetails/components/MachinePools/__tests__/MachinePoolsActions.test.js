import clusterService from '../../../../../../services/clusterService';
import {
  CLEAR_GET_MACHINE_POOLS_RESPONSE,
  DELETE_MACHINE_POOL,
  GET_MACHINE_POOLS,
} from '../machinePoolsActionConstants';
import {
  clearGetMachinePoolsResponse,
  deleteMachinePool,
  getMachineOrNodePools,
} from '../MachinePoolsActions';

jest.mock('../../../../../../services/clusterService');
clusterService.getNodePoolUpgradePolicies = jest.fn();

describe('MachinePools actions', () => {
  const mockDispatch = jest.fn();
  afterEach(() => {
    jest.clearAllMocks();
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

    it('calls getNodePoolUpgradePolicies when HCP, has feature flag, and version is behind control plane', async () => {
      clusterService.getNodePools.mockReturnValue({
        data: { items: [{ id: 'myPool', version: { id: '4.14.0' } }] },
      });

      expect(clusterService.getNodePoolUpgradePolicies).not.toHaveBeenCalled();
      await getMachineOrNodePools('mock-cluster-id', true, '4.14.1', true)(mockDispatch);
      expect(clusterService.getNodePools).toBeCalledWith('mock-cluster-id');
      expect(clusterService.getNodePoolUpgradePolicies).toHaveBeenCalledWith(
        'mock-cluster-id',
        'myPool',
      );
    });

    it('does not getNodePoolUpgradePolicies when HCP, but no feature flag', async () => {
      clusterService.getNodePools.mockReturnValue({
        data: { items: [{ id: 'myPool', version: { id: '4.14.0' } }] },
      });

      await getMachineOrNodePools('mock-cluster-id', true, '4.14.1', false)(mockDispatch);
      expect(clusterService.getNodePools).toBeCalledWith('mock-cluster-id');
      expect(clusterService.getNodePoolUpgradePolicies).not.toHaveBeenCalled();
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
