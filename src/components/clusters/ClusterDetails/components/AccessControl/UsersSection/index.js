import { connect } from 'react-redux';
import get from 'lodash/get';
import usersActions from './UsersActions';
import UsersSection from './UsersSection';

import shouldShowModal from '../../../../../common/Modal/ModalSelectors';
import { openModal, closeModal } from '../../../../../common/Modal/ModalActions';


const mapStateToProps = (state) => {
  const { groupUsers, addUserResponse, deleteUserResponse } = state.clusterUsers;
  const canAddClusterAdmin = get(state, 'clusters.details.cluster.cluster_admin_enabled', false);

  const getUsersPending = get(state, 'clusterUsers.groupUsers.dedicatedAdmins.pending')
  || get(state, 'clusterUsers.groupUsers.clusterAdmins.pending');

  const getUsersFulfilled = canAddClusterAdmin ? (get(state, 'clusterUsers.groupUsers.dedicatedAdmins.fulfilled')
  && get(state, 'clusterUsers.groupUsers.clusterAdmins.fulfilled')) : get(state, 'clusterUsers.groupUsers.dedicatedAdmins.fulfilled');

  const getUserErrors = [
    get(state, 'clusterUsers.groupUsers.dedicatedAdmins'),
    get(state, 'clusterUsers.groupUsers.clusterAdmins'),
  ].filter(response => response.error);

  return ({
    clusterGroupUsers: {
      ...groupUsers,
      users: [...groupUsers.dedicatedAdmins.users, ...groupUsers.clusterAdmins.users],
    },
    addUserResponse,
    deleteUserResponse,
    isAddUserModalOpen: shouldShowModal(state, 'add-user'),
    canAddClusterAdmin,
    toggleClusterAdminResponse: state.clusters.editedCluster,
    getUsersPending,
    getUsersFulfilled,
    getUserErrors,
    hasUsers: !!get(groupUsers, 'dedicatedAdmins.users.length', false) || !!get(groupUsers, 'clusterAdmins.users.length', false),
  });
};


const mapDispatchToProps = (dispatch, ownProps) => {
  const getAllowedUsers = () => {
    dispatch(usersActions.getDedicatedAdmins(ownProps.cluster.id));
    if (get(ownProps, 'cluster.cluster_admin_enabled')) {
      dispatch(usersActions.getClusterAdmins(ownProps.cluster.id));
    }
  };

  return ({
    openModal: modalId => dispatch(openModal(modalId)),
    closeModal: () => dispatch(closeModal()),
    getUsers: getAllowedUsers,
    addUser: (clusterID, groupID, userID) => dispatch(
      usersActions.addUser(clusterID, groupID, userID),
    ),
    deleteUser: (clusterID, groupID, userID) => dispatch(
      usersActions.deleteUser(clusterID, groupID, userID),
    ),
    clearUsersResponses: () => dispatch(
      usersActions.clearUsersResponses(),
    ),
    clearAddUserResponses: () => dispatch(usersActions.clearAddUserResponses()),
  });
};

export default connect(mapStateToProps, mapDispatchToProps)(UsersSection);
