import UsersConstants from './UsersConstants';
import { clusterService } from '../../../../../services';

const getUsers = (clusterID, groupID) => dispatch => dispatch({
  type: UsersConstants.GET_USERS,
  payload: clusterService.getClusterGroupUsers(clusterID, groupID).then(
    response => ({ clusterID, users: response }),
  ),
});

const addUser = (clusterID, groupID, userID) => dispatch => dispatch({
  type: UsersConstants.ADD_USER,
  payload: clusterService.addClusterGroupUser(clusterID, groupID, userID),
});

const deleteUser = (clusterID, groupID, userID) => dispatch => dispatch({
  type: UsersConstants.DELETE_USER,
  payload: clusterService.deleteClusterGroupUser(clusterID, groupID, userID),
});


const usersActions = {
  getUsers,
  addUser,
  deleteUser,
};

export default usersActions;
