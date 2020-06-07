import React from 'react';
import PropTypes from 'prop-types';

import { HelpIcon } from '@patternfly/react-icons';
import {
  EmptyState, Title, Button, CardHeader, CardFooter,
  Popover, PopoverPosition, Card, CardBody, Tooltip,
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

import AddUserDialog from './AddUserDialog';

class UsersSection extends React.Component {
  state = {
    deletedRowIndex: null,
  };

  componentDidMount() {
    const {
      clusterGroupUsers, cluster, getUsers, toggleClusterAdminResponse, getUsersPending,
    } = this.props;
    if (clusterGroupUsers.clusterID !== cluster.id
      || (!getUsersPending)
      // don't fetch usesrs if we jsut allowed/ removed cluster admin access
      || !toggleClusterAdminResponse.pending) {
      getUsers();
    }
  }

  componentDidUpdate(prevProps) {
    const {
      deleteUserResponse,
      addUserResponse,
      getUsers,
      toggleClusterAdminResponse,
      getUsersPending,
      getUsersFulfilled,
    } = this.props;
    const { deletedRowIndex } = this.state;

    // fetch users again if we just added/deleted a user.
    if (((deleteUserResponse.fulfilled && prevProps.deleteUserResponse.pending)
      || (addUserResponse.fulfilled && prevProps.addUserResponse.pending))
      && ((!getUsersPending)
      // don't fetch usesrs if we jsut allowed/ removed cluster admin access
      || !toggleClusterAdminResponse.pending)) {
      getUsers();
    }
    if (prevProps.getUsersPending
      && getUsersFulfilled && deletedRowIndex !== null) {
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
      cluster,
      deleteUser,
      addUser,
      isAddUserModalOpen,
      openModal,
      closeModal,
      clearAddUserResponses,
      canAddClusterAdmin,
      getUsersPending,
      getUserErrors,
      hasUsers,
    } = this.props;
    const { deletedRowIndex } = this.state;

    const columns = [
      {
        title: (
          <>
          User ID
            <Popover
              position={PopoverPosition.top}
              aria-label="User IDs"
              bodyContent={(
                <p>
                  User IDs are matched by the cluster&apos;s identity providers.
                </p>
              )}
            >
              <Button variant="plain" isInline>
                <HelpIcon size="sm" />
              </Button>
            </Popover>
          </>
        ),
      },
      {
        title: (
          <>
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
                </p>
              )}
            >
              <Button variant="plain" isInline>
                <HelpIcon size="sm" />
              </Button>
            </Popover>
          </>
        ),
      },
    ];

    const actions = [
      {
        title: 'Delete',
        onClick: (_, rowID, rowData) => { this.setState({ deletedRowIndex: rowID }); deleteUser(cluster.id, rowData['column-1'].title, rowData.userID); },
        className: 'hand-pointer',
      },
    ];

    const userRow = (user) => {
      // parse the url to get the user group
      const userHrefPathSections = user.href.match(/[^/?]*[^/?]/g);
      const userGroup = userHrefPathSections[6];

      return ({
        cells: [
          user.id,
          userGroup,
        ],
        userID: user.id,
      });
    };

    const getErrorBox = error => (
      <EmptyState>
        <ErrorBox message="Error getting cluster users" response={error} />
      </EmptyState>
    );

    if (!hasUsers && !!(getUserErrors.length)) {
      return (
        <>
          {getUserErrors.map(error => getErrorBox(error))}
        </>
      );
    }

    const learnMoreLink = <a rel="noopener noreferrer" href={links.DEDICATED_ADMIN_ROLE} target="_blank">Learn more.</a>;

    const userList = hasUsers ? clusterGroupUsers.users : [];
    const rows = hasUsers && userList.map(userRow);
    const showSkeleton = !hasUsers && getUsersPending;
    const skeletonRow = {
      cells: [
        {
          props: { colSpan: 2 },
          title: <Skeleton size="md" />,
        },
      ],
    };


    if (hasUsers
      && (getUsersPending
      || addUserResponse.pending) && deletedRowIndex === null) {
      rows.push(skeletonRow);
    }
    if (hasUsers && deletedRowIndex !== null) {
      rows[deletedRowIndex] = skeletonRow;
    }

    const addUserBtn = (
      <Button onClick={() => openModal('add-user')} variant="secondary" className="access-control-add" isDisabled={!cluster.canEdit}>
        Add user
      </Button>
    );

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
        {!!(getUserErrors.length) && getUserErrors.map(error => getErrorBox(error))}
        <CardBody>
          <Title className="card-title" headingLevel="h3" size="lg">Cluster administrative users</Title>
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
          { hasUsers && (
            <Table aria-label="Users" actions={actions} variant={TableVariant.compact} cells={columns} rows={rows} areActionsDisabled={() => !cluster.canEdit}>
              <TableHeader />
              <TableBody />
            </Table>
          )}
          {!cluster.canEdit ? (
            <Tooltip content="You do not have permission to add a user. Only cluster owners and organization administrators can add users.">
              <span>
                {addUserBtn}
              </span>
            </Tooltip>
          )
            : addUserBtn}
          <AddUserDialog
            isOpen={isAddUserModalOpen}
            closeModal={closeModal}
            clearAddUserResponses={clearAddUserResponses}
            addUserResponse={addUserResponse}
            submit={addUser}
            clusterID={cluster.id}
            canAddClusterAdmin={canAddClusterAdmin}
          />
        </CardBody>
      </Card>
    );
  }
}

UsersSection.propTypes = {
  cluster: PropTypes.object.isRequired,
  isAddUserModalOpen: PropTypes.bool.isRequired,
  addUser: PropTypes.func.isRequired,
  addUserResponse: PropTypes.object,
  getUsers: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
  deleteUserResponse: PropTypes.object,
  clusterGroupUsers: PropTypes.object.isRequired,
  openModal: PropTypes.func.isRequired,
  canAddClusterAdmin: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  clearUsersResponses: PropTypes.func.isRequired,
  clearAddUserResponses: PropTypes.func.isRequired,
  toggleClusterAdminResponse: PropTypes.object.isRequired,
  getUsersPending: PropTypes.bool.isRequired,
  getUsersFulfilled: PropTypes.bool.isRequired,
  getUserErrors: PropTypes.array.isRequired,
  hasUsers: PropTypes.bool.isRequired,
};

export default UsersSection;
