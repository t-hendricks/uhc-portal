import UsersConstants from './UsersConstants';
import { clusterService } from '../../../../../../services';

const getUsersPayloadload = (clusterID, userGroups) => {
  const users = [];
  const promises = [];
  userGroups.forEach((userGroup) => {
    promises.push(
      clusterService.getClusterGroupUsers(clusterID, userGroup)
        .then(
          response => response.data.items.forEach(user => users.push(user)),
        ).catch(errorData => ({ errorData, userGroup })), // handle error
    );
  });
  return Promise.all(promises).then(errors => ({ clusterID, users, errors }));
};

const getUsers = (clusterID, userGroups = ['dedicated-admins', 'cluster-admins']) => dispatch => dispatch({
  type: UsersConstants.GET_USERS,
  payload: getUsersPayloadload(clusterID, userGroups),
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
