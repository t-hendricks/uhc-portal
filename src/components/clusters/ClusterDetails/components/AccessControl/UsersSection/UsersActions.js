import UsersConstants from './UsersConstants';
import { clusterService } from '../../../../../../services';

const getUsers = clusterID => dispatch => dispatch({
  type: UsersConstants.GET_USERS,
  payload: clusterService.getClusterGroupUsers(clusterID),
});

const addUser = (clusterID, groupID, userID) => dispatch => dispatch({
  type: UsersConstants.ADD_USER,
  payload: clusterService.addClusterGroupUser(clusterID, groupID, userID),
});

const deleteUser = (clusterID, groupID, userID) => dispatch => dispatch({
  type: UsersConstants.DELETE_USER,
  payload: clusterService.deleteClusterGroupUser(clusterID, groupID, userID),
});

const clearUsersResponses = () => ({
  type: UsersConstants.CLEAR_USER_RESPONSES,
});

const clearAddUserResponses = () => ({
  type: UsersConstants.CLEAR_ADD_USER_RESPONSES,
});

const usersActions = {
  getUsers,
  addUser,
  deleteUser,
  clearUsersResponses,
  clearAddUserResponses,
};

export default usersActions;
