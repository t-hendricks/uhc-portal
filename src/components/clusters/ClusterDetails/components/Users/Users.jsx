import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import { UsersIcon, HelpIcon, TimesIcon } from '@patternfly/react-icons';
import {
  Card, CardBody, EmptyState, EmptyStateBody, Title, EmptyStateIcon, Button, Grid, GridItem,
  Popover, PopoverPosition,
} from '@patternfly/react-core';
import {
  Spinner,
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
          <EmptyStateIcon icon={UsersIcon} />
          <Title headingLevel="h5" size="lg">No users exist for this cluster</Title>
          <EmptyStateBody>
                You can add users to grant them access to the cluster. Users will be authenticated
                via your selected identity provider.
          </EmptyStateBody>
          <Button onClick={this.showAddUserRow}>
            Add user
          </Button>
        </EmptyState>
      );
    }

    const userList = hasUsers ? clusterGroupUsers.users.items : [];

    return (
      <Card>
        <CardBody>
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
            <Grid>
              {!!userList.length && (
              <Grid>
                <GridItem sm={2}>
                  <h3>
                  User ID
                    <Popover
                      position={PopoverPosition.top}
                      aria-label="User IDs"
                      bodyContent={(
                        <p>
                        User IDs are matched by the cluster&apos;s identity providers.
                        </p>)}
                    >
                      <Button variant="plain" isInline>
                        <HelpIcon size="sm" />
                      </Button>
                    </Popover>
                  </h3>
                </GridItem>
                <GridItem sm={2}>
                  <h3>
                  Group
                    <Popover
                      position={PopoverPosition.top}
                      aria-label="Groups"
                      bodyContent={(
                        <p>
                        Groups are mapped to role bindings on the cluster.
                          {' '}
                        For more information check the
                          {' '}
                          <a href="https://docs.openshift.com/container-platform/4.1/authentication/understanding-authentication.html">OpenShift 4 documentation</a>
                          .
                        </p>)}
                    >
                      <Button variant="plain" isInline>
                        <HelpIcon size="sm" />
                      </Button>
                    </Popover>
                  </h3>
                </GridItem>
                  { (deleteUserResponse.pending || clusterGroupUsers.pending) && (
                  <GridItem sm={1}>
                    <Spinner loading />
                  </GridItem>
                  )}
              </Grid>
              )}
              {userList.map(user => (
                <Grid key={user.id}>
                  <GridItem sm={2}>
                    {user.id}
                  </GridItem>
                  <GridItem sm={2}>
                dedicated-admins
                  </GridItem>
                  <GridItem sm={1}>
                    <Button variant="plain" aria-label="Delete" onClick={() => { deleteUser(clusterID, 'dedicated-admins', user.id); }}>
                      <TimesIcon />
                    </Button>
                  </GridItem>
                </Grid>
              ))}
              <GridItem sm={3}>
                <h3>Add user:</h3>
              </GridItem>
              <UserInputForm
                clusterID={clusterID}
                saveUser={addUser}
                pending={addUserResponse.pending}
              />
            </Grid>
          </div>
        </CardBody>
      </Card>
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
