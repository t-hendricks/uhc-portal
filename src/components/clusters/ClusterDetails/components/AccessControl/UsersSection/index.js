import { connect } from 'react-redux';
import usersActions from './UsersActions';
import UsersSection from './UsersSection';

const mapStateToProps = (state) => {
  const { groupUsers, addUserResponse, deleteUserResponse } = state.clusterUsers;
  return ({
    clusterGroupUsers: groupUsers,
    addUserResponse,
    deleteUserResponse,
  });
};

const mapDispatchToProps = {
  getUsers: usersActions.getUsers,
  addUser: usersActions.addUser,
  deleteUser: usersActions.deleteUser,
  clearUsersResponses: usersActions.clearUsersResponses,
};

export default connect(mapStateToProps, mapDispatchToProps)(UsersSection);
