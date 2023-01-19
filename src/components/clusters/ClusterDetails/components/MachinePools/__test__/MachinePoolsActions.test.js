import {
  GET_MACHINE_POOLS,
  ADD_MACHINE_POOL,
  SCALE_MACHINE_POOL,
  DELETE_MACHINE_POOL,
  CLEAR_ADD_MACHINE_POOL_RESPONSE,
  CLEAR_SCALE_MACHINE_POOL_RESPONSE,
  CLEAR_GET_MACHINE_POOLS_RESPONSE,
  getMachineOrNodePools,
  addMachinePool,
  scaleMachinePool,
  deleteMachinePool,
  clearAddMachinePoolResponse,
  clearGetMachinePoolsResponse,
  clearScaleMachinePoolResponse,
} from '../MachinePoolsActions';
import { clusterService } from '../../../../../../services';

jest.mock('../../../../../../services/clusterService');

describe('MachinePools actions', () => {
  let mockDispatch;
  beforeEach(() => {
    mockDispatch = jest.fn();
  });

  describe('getMachinePools', () => {
    it('dispatches successfully', () => {
      getMachineOrNodePools('mock-cluster-id')(mockDispatch);
      expect(mockDispatch).toBeCalledWith({
        payload: expect.anything(),
        type: GET_MACHINE_POOLS,
      });
    });

    it('calls clusterService.getMachinePools', () => {
      getMachineOrNodePools('mock-cluster-id')(mockDispatch);
      expect(clusterService.getMachinePools).toBeCalledWith('mock-cluster-id');
    });

    it('calls clusterService.getNodePools', () => {
      getMachineOrNodePools('mock-cluster-id', true)(mockDispatch);
      expect(clusterService.getNodePools).toBeCalledWith('mock-cluster-id');
    });
  });

  describe('addMachinePool', () => {
    it('dispatches successfully', () => {
      addMachinePool('mock-cluster-id', { id: 'mp-id', replicas: 1, instance_type: 'type' })(
        mockDispatch,
      );
      expect(mockDispatch).toBeCalledWith({
        payload: expect.anything(),
        type: ADD_MACHINE_POOL,
      });
    });

    it('calls clusterService.addMachinePool', () => {
      addMachinePool('mock-cluster-id', { id: 'mp-id', replicas: 1, instance_type: 'type' })(
        mockDispatch,
      );
      expect(clusterService.addMachinePool).toBeCalledWith('mock-cluster-id', {
        id: 'mp-id',
        replicas: 1,
        instance_type: 'type',
      });
    });
  });

  describe('scaleMachinePool', () => {
    it('dispatches successfully', () => {
      scaleMachinePool('mock-cluster-id', 'mock-mp-id')(mockDispatch);
      expect(mockDispatch).toBeCalledWith({
        payload: expect.anything(),
        type: SCALE_MACHINE_POOL,
      });
    });

    it('calls clusterService.deleteMachinePool', () => {
      scaleMachinePool('mock-cluster-id', 'mock-mp-id', { replicas: 2 })(mockDispatch);
      expect(clusterService.scaleMachinePool).toBeCalledWith('mock-cluster-id', 'mock-mp-id', {
        replicas: 2,
      });
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

  describe('clearAddMachinePoolResponse', () => {
    it('dispatches successfully', () => {
      clearAddMachinePoolResponse()(mockDispatch);
      expect(mockDispatch).toBeCalledWith({
        type: CLEAR_ADD_MACHINE_POOL_RESPONSE,
      });
    });
  });

  describe('clearGetMachinePoolsResponse', () => {
    it('dispatches successfully', () => {
      clearGetMachinePoolsResponse()(mockDispatch);
      expect(mockDispatch).toBeCalledWith({
        type: CLEAR_GET_MACHINE_POOLS_RESPONSE,
      });
    });
  });

  describe('clearScaleMachinePoolResponse', () => {
    it('dispatches successfully', () => {
      clearScaleMachinePoolResponse()(mockDispatch);
      expect(mockDispatch).toBeCalledWith({
        type: CLEAR_SCALE_MACHINE_POOL_RESPONSE,
      });
    });
  });
});
