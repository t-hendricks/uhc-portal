import { clustersActions } from './clustersActions';
import { clusterService, accountsService } from '../../services';
import { clustersConstants } from '../constants';
import { INVALIDATE_ACTION } from '../reduxHelpers';

jest.mock('../../services/accountsService');
jest.mock('../../services/authorizationsService');
jest.mock('../../services/clusterService');

describe('clustersActions', () => {
  let mockDispatch;
  beforeEach(() => {
    mockDispatch = jest.fn();
  });

  describe('invalidateClusters', () => {
    it('dispatches successfully', () => {
      const result = clustersActions.invalidateClusters();
      expect(result).toEqual(
        expect.objectContaining({
          type: INVALIDATE_ACTION(clustersConstants.GET_CLUSTERS),
        }),
      );
    });
  });

  describe('createCluster', () => {
    it('dispatches successfully', () => {
      const fakeParams = { fake: 'params' };
      clustersActions.createCluster(fakeParams)(mockDispatch);
      expect(mockDispatch).toBeCalledWith({
        payload: expect.anything(),
        type: clustersConstants.CREATE_CLUSTER,
      });
    });

    it('calls clusterService.postNewCluster', () => {
      const fakeParams = { fake: 'params' };
      clustersActions.createCluster(fakeParams)(mockDispatch);
      expect(clusterService.postNewCluster).toBeCalledWith(fakeParams);
    });
  });

  describe('clearClusterResponse', () => {
    it('dispatches successfully', () => {
      const result = clustersActions.clearClusterResponse();
      expect(result).toEqual({
        type: clustersConstants.CLEAR_DISPLAY_NAME_RESPONSE,
      });
    });
  });

  describe('editCluster', () => {
    it('dispatches successfully', () => {
      const result = clustersActions.editCluster();
      expect(result).toEqual(
        expect.objectContaining({
          type: clustersConstants.EDIT_CLUSTER,
        }),
      );
    });

    it('calls clusterService.editCluster', () => {
      const fakeParams = { fake: 'params' };
      clustersActions.editCluster('fakeID', fakeParams);
      expect(clusterService.editCluster).toBeCalledWith('fakeID', fakeParams);
    });
  });

  describe('fetchClusters', () => {
    it('dispatches successfully', () => {
      const mockGetState = jest.fn().mockImplementation(() => ({
        features: {},
      }));
      clustersActions.fetchClusters({})(mockDispatch, mockGetState);
      expect(mockDispatch).toBeCalledWith({
        payload: expect.anything(),
        type: clustersConstants.GET_CLUSTERS,
      });
    });
  });

  describe('fetchClusterDetails', () => {
    it('dispatches successfully', () => {
      const result = clustersActions.fetchClusterDetails();
      expect(result).toEqual({
        type: clustersConstants.GET_CLUSTER_DETAILS,
        payload: expect.anything(),
      });
    });

    it('calls clusterService.getClusterDetails', () => {
      const fakeParams = { fake: 'params' };
      clustersActions.fetchClusterDetails(fakeParams);
      expect(accountsService.getSubscription).toBeCalledWith(fakeParams);
    });
  });

  describe('resetCreatedClusterResponse', () => {
    it('dispatches successfully', () => {
      const result = clustersActions.resetCreatedClusterResponse();
      expect(result).toEqual({
        type: clustersConstants.RESET_CREATED_CLUSTER_RESPONSE,
      });
    });
  });
});
