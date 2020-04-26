import UsersActions from '../UsersActions';
import { clusterService } from '../../../../../../../services';
import UsersConstants from '../UsersConstants';

jest.mock('../../../../../../../services/clusterService.js');

describe('ClusterDetails UserActions', () => {
  let mockDispatch;
  beforeEach(() => {
    mockDispatch = jest.fn();
  });

  describe('getUsers', () => {
    it('dispatches successfully', () => {
      UsersActions.getDedicatedAdmins('fake id')(mockDispatch);
      expect(mockDispatch).toBeCalledWith({
        payload: expect.anything(),
        type: UsersConstants.GET_DEDICATED_ADMNIS,
      });
    });

    it('calls clusterService.getClusterGroupUsers - dedicated admins', () => {
      UsersActions.getDedicatedAdmins('fake id')(mockDispatch);
      expect(clusterService.getClusterGroupUsers).toBeCalledWith('fake id', 'dedicated-admins');
    });

    it('calls clusterService.getClusterGroupUsers - cluster admins', () => {
      UsersActions.getClusterAdmins('fake id')(mockDispatch);
      expect(clusterService.getClusterGroupUsers).toBeCalledWith('fake id', 'cluster-admins');
    });
  });

  describe('addUser', () => {
    it('dispatches successfully', () => {
      UsersActions.addUser('fake id', 'fake-group', 'fake-user')(mockDispatch);
      expect(mockDispatch).toBeCalledWith({
        payload: expect.anything(),
        type: UsersConstants.ADD_USER,
      });
    });

    it('calls clusterService.addClusterGroupUser', () => {
      UsersActions.addUser('fake id', 'fake-group', 'fake-user')(mockDispatch);
      expect(clusterService.addClusterGroupUser).toBeCalledWith('fake id', 'fake-group', 'fake-user');
    });
  });

  describe('deleteUser', () => {
    it('dispatches successfully', () => {
      UsersActions.deleteUser('fake id', 'fake-group', 'fake-user')(mockDispatch);
      expect(mockDispatch).toBeCalledWith({
        payload: expect.anything(),
        type: UsersConstants.DELETE_USER,
      });
    });

    it('calls clusterService.getClusterGroupUsers', () => {
      UsersActions.deleteUser('fake id', 'fake-group', 'fake-user')(mockDispatch);
      expect(clusterService.deleteClusterGroupUser).toBeCalledWith('fake id', 'fake-group', 'fake-user');
    });
  });
});
