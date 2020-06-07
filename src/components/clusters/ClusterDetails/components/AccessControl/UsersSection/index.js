import { connect } from 'react-redux';
import get from 'lodash/get';
import usersActions from './UsersActions';
import UsersSection from './UsersSection';

import shouldShowModal from '../../../../../common/Modal/ModalSelectors';
import { openModal, closeModal } from '../../../../../common/Modal/ModalActions';


const mapStateToProps = (state) => {
  const { groupUsers, addUserResponse, deleteUserResponse } = state.clusterUsers;
  const canAddClusterAdmin = get(state, 'clusters.details.cluster.cluster_admin_enabled', false);

  return ({
    clusterGroupUsers: groupUsers,
    hasUsers: groupUsers.users.length > 0,
    addUserResponse,
    deleteUserResponse,
    isAddUserModalOpen: shouldShowModal(state, 'add-user'),
    canAddClusterAdmin,
    toggleClusterAdminResponse: state.clusters.editedCluster,
  });
};


const mapDispatchToProps = (dispatch, ownProps) => ({
  openModal: modalId => dispatch(openModal(modalId)),
  closeModal: () => dispatch(closeModal()),
  getUsers: () => dispatch(usersActions.getUsers(ownProps.cluster.id)),
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

export default connect(mapStateToProps, mapDispatchToProps)(UsersSection);
