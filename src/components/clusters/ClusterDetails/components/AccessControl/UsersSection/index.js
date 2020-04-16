import { connect } from 'react-redux';
import get from 'lodash/get';
import usersActions from './UsersActions';
import UsersSection from './UsersSection';

import shouldShowModal from '../../../../../common/Modal/ModalSelectors';
import { openModal, closeModal } from '../../../../../common/Modal/ModalActions';


const mapStateToProps = (state) => {
  const { groupUsers, addUserResponse, deleteUserResponse } = state.clusterUsers;
  const canAddClusterAdmin = get(state, 'clusters.details.cluster.cluster_admin_enabled', false);
  let clusterGroupUsers = groupUsers;

  // filter cluster-admin error if it's irrelevant
  let filteredErrors = [];
  if (!canAddClusterAdmin) {
    filteredErrors = [...groupUsers.errors].filter(error => error.userGroup !== 'cluster-admins');
    clusterGroupUsers = { ...groupUsers, errors: filteredErrors };
  }

  return ({
    clusterGroupUsers,
    addUserResponse,
    deleteUserResponse,
    isAddUserModalOpen: shouldShowModal(state, 'add-user'),
    canAddClusterAdmin,
  });
};

const mapDispatchToProps = {
  openModal,
  closeModal,
  getUsers: usersActions.getUsers,
  addUser: usersActions.addUser,
  deleteUser: usersActions.deleteUser,
  clearUsersResponses: usersActions.clearUsersResponses,
  clearAddUserResponses: usersActions.clearAddUserResponses,
};

export default connect(mapStateToProps, mapDispatchToProps)(UsersSection);
