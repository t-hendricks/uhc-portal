import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import { HelpIcon } from '@patternfly/react-icons';
import {
  Bullseye, EmptyState, EmptyStateBody, EmptyStateVariant,
  Title, Button, CardHeader, CardFooter,
  Popover, PopoverPosition, Card, CardBody,
} from '@patternfly/react-core';
import {
  Table,
  TableHeader,
  TableBody,
  TableVariant,
} from '@patternfly/react-table';

import { Skeleton } from '@redhat-cloud-services/frontend-components';

import links from '../../../../../../common/installLinks';
import ErrorBox from '../../../../../common/ErrorBox';

import UserInputForm from './UserInputForm';

class UsersSection extends React.Component {
  state = {
    deletedRowIndex: null,
  };

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
    const { deletedRowIndex } = this.state;

    if (((deleteUserResponse.fulfilled && prevProps.deleteUserResponse.pending)
      || (addUserResponse.fulfilled && prevProps.addUserResponse.pending))
      && !clusterGroupUsers.pending) {
      // fetch users again if we just added/deleted a user.
      getUsers(clusterID, 'dedicated-admins');
    }
    if (prevProps.clusterGroupUsers.pending
      && clusterGroupUsers.fulfilled && deletedRowIndex !== null) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ deletedRowIndex: null });
    }
  }

  componentWillUnmount() {
    const { clearUsersResponses } = this.props;
    clearUsersResponses();
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
    const { deletedRowIndex } = this.state;

    const columns = [
      {
        title: (
          <React.Fragment>
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
          </React.Fragment>
        ),
      },
      {
        title: (
          <React.Fragment>
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
                  <a href={links.UNDERSTANDING_AUTHENTICATION}>OpenShift 4 documentation</a>
                  .
                </p>)}
            >
              <Button variant="plain" isInline>
                <HelpIcon size="sm" />
              </Button>
            </Popover>
          </React.Fragment>
        ),
      },
    ];

    const actions = [
      {
        title: 'Delete',
        onClick: (_, rowID, rowData) => { this.setState({ deletedRowIndex: rowID }); deleteUser(clusterID, 'dedicated-admins', rowData.userID); },
      },
    ];

    const userRow = user => ({
      cells: [
        user.id,
        'dedicated-admins',
      ],
      userID: user.id,
    });

    if (clusterGroupUsers.error) {
      return (
        <EmptyState>
          <ErrorBox message="Error getting cluster users" response={clusterGroupUsers} />
        </EmptyState>
      );
    }

    const learnMoreLink = <a rel="noopener noreferrer" href={links.DEDICATED_ADMIN_ROLE}>Learn more.</a>;

    const hasUsers = get(clusterGroupUsers.users, 'items.length', false);

    const tableEmptyState = [
      {
        heightAuto: true,
        cells: [
          {
            props: { colSpan: 2 },
            title: (
              <Bullseye>
                <EmptyState variant={EmptyStateVariant.small}>
                  <Title headingLevel="h2" size="lg">
                    No users exist for this cluster
                  </Title>
                  <EmptyStateBody>
                    You can add users to grant them administrator access to the cluster.
                    Users will be authenticated via your selected identity provider.
                    {' '}
                    {learnMoreLink}
                  </EmptyStateBody>
                </EmptyState>
              </Bullseye>
            ),
          },
        ],
      },
    ];

    const userList = hasUsers ? clusterGroupUsers.users.items : [];
    const rows = hasUsers ? userList.map(userRow) : tableEmptyState;
    const showSkeleton = !hasUsers && clusterGroupUsers.pending;
    const skeletonRow = {
      cells: [
        {
          props: { colSpan: 2 },
          title: <Skeleton size="md" />,
        },
      ],
    };


    if (hasUsers
      && (clusterGroupUsers.pending || addUserResponse.pending) && deletedRowIndex === null) {
      rows.push(skeletonRow);
    }
    if (hasUsers && deletedRowIndex !== null) {
      rows[deletedRowIndex] = skeletonRow;
    }

    return showSkeleton ? (
      <Card>
        <CardHeader>
          <Skeleton size="md" />
        </CardHeader>
        <CardBody>
          <Skeleton size="lg" />
        </CardBody>
        <CardFooter>
          <Skeleton size="md" />
        </CardFooter>
      </Card>
    ) : (
      <Card>
        <CardBody>
          <Title size="lg" headingLevel="h3">Cluster Administrative Users</Title>
          <p>
            Grant permission to manage this cluster to users defined in your identity provider.
            {' '}
            {learnMoreLink}
          </p>
          { addUserResponse.error && (
            <ErrorBox message="Error adding user" response={addUserResponse} />
          )}
          { deleteUserResponse.error && (
            <ErrorBox message="Error deleting user" response={deleteUserResponse} />
          )}
          <Table aria-label="Users" actions={hasUsers ? actions : []} variant={TableVariant.compact} cells={columns} rows={rows}>
            <TableHeader />
            <TableBody />
          </Table>
          <h3>Add user:</h3>
          <UserInputForm
            clusterID={clusterID}
            saveUser={addUser}
            pending={addUserResponse.pending}
          />
        </CardBody>
      </Card>
    );
  }
}

UsersSection.propTypes = {
  clusterID: PropTypes.string.isRequired,
  addUserResponse: PropTypes.object,
  deleteUserResponse: PropTypes.object,
  clusterGroupUsers: PropTypes.object.isRequired,
  getUsers: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
  addUser: PropTypes.func.isRequired,
  clearUsersResponses: PropTypes.func.isRequired,
};

export default UsersSection;
