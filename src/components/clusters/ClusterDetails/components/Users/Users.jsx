import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import {
  Button, EmptyState, EmptyStateTitle, EmptyStateInfo, EmptyStateAction,
  Grid, Col, Row, Spinner, FieldLevelHelp,
} from 'patternfly-react';

import ErrorBox from '../../../../common/ErrorBox';

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

  componentWillUnmount() {
    const { clearUsersResponses } = this.props;
    clearUsersResponses();
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
          <ErrorBox message="Error getting cluster users" response={clusterGroupUsers} />
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
          <ErrorBox message="Error adding user" response={addUserResponse} />
        )}
        { deleteUserResponse.error && (
          <ErrorBox message="Error deleting user" response={deleteUserResponse} />
        )}
        <p>
          Grant permission to manage this cluster to users defined in your identity provider.
        </p>
        <Grid fluid>
          {!!userList.length && (
            <Row key="clusterusers-titlerow">
              <Col sm={2}>
                <h3>
                  User ID
                  <FieldLevelHelp content={(
                    <p>
                      User IDs are matched by the cluster&apos;s identity providers.
                    </p>)}
                  />
                </h3>
              </Col>
              <Col sm={2}>
                <h3>
                  Group
                  <FieldLevelHelp content={(
                    <p>
                      Groups are mapped to role bindings on the cluster.
                      {' '}
                      For more information check the
                      {' '}
                      <a href="https://docs.openshift.com/container-platform/4.1/authentication/understanding-authentication.html">OpenShift 4 documentation</a>
                      .
                    </p>)}
                  />
                </h3>
              </Col>
              { (deleteUserResponse.pending || clusterGroupUsers.pending) && (
                <Col sm={1}>
                  <Spinner loading />
                </Col>
              )}
            </Row>
          )}
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
            <Col sm={3}>
              <h3>Add user:</h3>
            </Col>
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
  clearUsersResponses: PropTypes.func.isRequired,
};

export default Users;
