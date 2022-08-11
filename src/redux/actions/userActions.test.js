import { userActions } from './userActions';
import { userConstants } from '../constants';

jest.mock('../../services/accountsService.js');

// See also quotaSelectors.test.js checking processQuota -> selectors together.

describe('clustersActions', () => {
  let mockDispatch;
  beforeEach(() => {
    mockDispatch = jest.fn();
  });

  describe('getOrganizationAndQuota', () => {
    it('dispatches successfully', () => {
      const mockGetState = jest.fn().mockImplementation(() => ({}));
      userActions.getOrganizationAndQuota({})(mockDispatch, mockGetState);
      expect(mockDispatch).toBeCalledWith({
        payload: expect.anything(),
        type: userConstants.GET_ORGANIZATION,
      });
    });
  });
});
