import { connect } from 'react-redux';

import usersActions from './UsersActions';
import UsersSection from './UsersSection';
import canAllowAdminSelector from './UsersSelector';
import shouldShowModal from '../../../../../common/Modal/ModalSelectors';
import { openModal, closeModal } from '../../../../../common/Modal/ModalActions';

const mapStateToProps = (state) => {
  const { groupUsers, addUserResponse, deleteUserResponse } = state.clusterUsers;
  const canAddClusterAdmin = canAllowAdminSelector(state);

  return {
    clusterGroupUsers: groupUsers,
    hasUsers: groupUsers.users.length > 0,
    addUserResponse,
    deleteUserResponse,
    isAddUserModalOpen: shouldShowModal(state, 'add-user'),
    canAddClusterAdmin,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  openModal: (modalId) => dispatch(openModal(modalId)),
  closeModal: () => dispatch(closeModal()),
  getUsers: () => dispatch(usersActions.getUsers(ownProps.cluster.id)),
  addUser: (clusterID, groupID, userID) =>
    dispatch(usersActions.addUser(clusterID, groupID, userID)),
  deleteUser: (clusterID, groupID, userID) =>
    dispatch(usersActions.deleteUser(clusterID, groupID, userID)),
  clearUsersResponses: () => dispatch(usersActions.clearUsersResponses()),
  clearAddUserResponses: () => dispatch(usersActions.clearAddUserResponses()),
});

export default connect(mapStateToProps, mapDispatchToProps)(UsersSection);
