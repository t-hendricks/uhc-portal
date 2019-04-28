import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import {
  Button, EmptyState, EmptyStateTitle, EmptyStateInfo, EmptyStateAction,
  Grid, Col, Row, Spinner, Alert,
} from 'patternfly-react';

import UserInputForm from './UserInputForm';

class Users extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddUserRow: false,
    };
    this.showAddUserRow = this.showAddUserRow.bind(this);
  }

  componentDidMount() {
    const { clusterGroupUsers, clusterID, getUsers } = this.props;
    if (clusterGroupUsers.clusterID !== clusterID
      || (!clusterGroupUsers.pending)) {
      getUsers(clusterID, 'dedicated-admins');
    }
  }

  componentDidUpdate(prevProps) {
    const {
      deleteUserResponse, addUserResponse, getUsers, clusterID, clusterGroupUsers,
    } = this.props;

    if (((deleteUserResponse.fulfilled && prevProps.deleteUserResponse.pending)
      || (addUserResponse.fulfilled && prevProps.addUserResponse.pending))
      && !clusterGroupUsers.pending) {
      // fetch users again if we just added/deleted a user.
      getUsers(clusterID, 'dedicated-admins');
    }
  }

  showAddUserRow() {
    this.setState({ showAddUserRow: true });
  }

  render() {
    const {
      clusterGroupUsers,
      addUserResponse,
      deleteUserResponse,
      clusterID,
      deleteUser,
      addUser,
    } = this.props;
    const { showAddUserRow } = this.state;

    if (clusterGroupUsers.error) {
      return (
        <EmptyState>
          <Alert type="error">
            <span>{`Error getting cluster users: ${clusterGroupUsers.errorMessage}`}</span>
          </Alert>
        </EmptyState>
      );
    }

    const hasUsers = get(clusterGroupUsers.users, 'items.length', false);

    if (!showAddUserRow && !hasUsers) {
      return (
        <EmptyState className="cluster-details-user-tab-contents">
          <EmptyStateTitle>No users exist for this cluster</EmptyStateTitle>
          <EmptyStateInfo>
            You can add users to grant them access to the cluster. Users will be authenticated
            via your selected identity provider.
          </EmptyStateInfo>
          <EmptyStateAction>
            <Button onClick={this.showAddUserRow}>
              Add user
            </Button>
          </EmptyStateAction>
        </EmptyState>
      );
    }

    const userList = hasUsers ? clusterGroupUsers.users.items : [];

    return (
      <div className="cluster-details-user-tab-contents">
        { addUserResponse.error && (
          <Alert type="error">
            <span>{`Error adding user: ${addUserResponse.errorMessage}`}</span>
          </Alert>
        )}
        { deleteUserResponse.error && (
          <Alert type="error">
            <span>{`Error deleting user: ${deleteUserResponse.errorMessage}`}</span>
          </Alert>
        )}
        <Grid fluid>
          <Row key="clusterusers-titlerow">
            <Col sm={2}><h3>User ID</h3></Col>
            <Col sm={2}><h3>Group</h3></Col>
            { deleteUserResponse.pending && (
              <Col sm={1}>
                <Spinner loading />
              </Col>
            )}
          </Row>
          {userList.map(user => (
            <Row key={user.id}>
              <Col sm={2}>
                {user.id}
              </Col>
              <Col sm={2}>
                dedicated-admins
              </Col>
              <Col sm={1}>
                <Button onClick={() => { deleteUser(clusterID, 'dedicated-admins', user.id); }}>
                  Delete
                </Button>
              </Col>
            </Row>
          ))}
          <Row key="clusterusers-addusers-title">
            <h3>Add user:</h3>
          </Row>
          <Row key="clusterusers-input-form">
            <UserInputForm
              clusterID={clusterID}
              saveUser={addUser}
              pending={addUserResponse.pending}
            />
          </Row>
        </Grid>
      </div>
    );
  }
}

Users.propTypes = {
  clusterID: PropTypes.string.isRequired,
  addUserResponse: PropTypes.object,
  deleteUserResponse: PropTypes.object,
  clusterGroupUsers: PropTypes.object.isRequired,
  getUsers: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
  addUser: PropTypes.func.isRequired,
};

export default Users;
