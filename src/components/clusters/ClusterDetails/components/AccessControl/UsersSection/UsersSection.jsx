import React from 'react';
import PropTypes from 'prop-types';

import { HelpIcon } from '@patternfly/react-icons';
import {
  EmptyState, Title, Button, CardFooter,
  Popover, PopoverPosition, Card, CardBody, CardTitle,
} from '@patternfly/react-core';
import {
  Table,
  TableHeader,
  TableBody,
  TableVariant,
} from '@patternfly/react-table';

import Skeleton from '@redhat-cloud-services/frontend-components/Skeleton';

import links from '../../../../../../common/installLinks';
import ErrorBox from '../../../../../common/ErrorBox';
import ExternalLink from '../../../../../common/ExternalLink';
import ButtonWithTooltip from '../../../../../common/ButtonWithTooltip';

import AddUserDialog from './AddUserDialog';

class UsersSection extends React.Component {
  state = {
    deletedRowIndex: null,
  };

  componentDidMount() {
    const {
      clusterGroupUsers, cluster, getUsers,
    } = this.props;
    if (clusterGroupUsers.clusterID !== cluster.id || !clusterGroupUsers.pending) {
      getUsers();
    }
  }

  componentDidUpdate(prevProps) {
    const {
      deleteUserResponse,
      addUserResponse,
      getUsers,
      clusterGroupUsers,
    } = this.props;
    const { deletedRowIndex } = this.state;

    // fetch users again if we just added/deleted a user.
    if (((deleteUserResponse.fulfilled && prevProps.deleteUserResponse.pending)
      || (addUserResponse.fulfilled && prevProps.addUserResponse.pending))
      && !clusterGroupUsers.pending) {
      getUsers();
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
      cluster,
      clusterHibernating,
      isReadOnly,
      deleteUser,
      addUser,
      isAddUserModalOpen,
      openModal,
      closeModal,
      clearAddUserResponses,
      canAddClusterAdmin,
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

    const userRow = user => ({
      cells: [
        user.id,
        user.group,
      ],
      userID: user.id,
    });

    if (!hasUsers && clusterGroupUsers.error) {
      return (
        <EmptyState>
          <ErrorBox message="Error getting cluster users" response={clusterGroupUsers} />
        </EmptyState>
      );
    }

    const rows = hasUsers && clusterGroupUsers.users.map(userRow);
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
      && (clusterGroupUsers.pending
      || addUserResponse.pending) && deletedRowIndex === null) {
      rows.push(skeletonRow);
    }
    if (hasUsers && deletedRowIndex !== null) {
      rows[deletedRowIndex] = skeletonRow;
    }

    const readOnlyReason = isReadOnly && 'This operation is not available during maintenance';
    const hibernatingReason = clusterHibernating && 'This operation is not available while cluster is hibernating';
    const canNotEditReason = !cluster.canEdit && 'You do not have permission to add a user. Only cluster owners, cluster editors, and organization administrators can add users.';
    const disableReason = readOnlyReason || hibernatingReason || canNotEditReason;

    const addUserBtn = (
      <ButtonWithTooltip
        onClick={() => { setTimeout(() => openModal('add-user'), 0); }}
        variant="secondary"
        className="access-control-add"
        disableReason={disableReason}
      >
        Add user
      </ButtonWithTooltip>
    );

    return showSkeleton ? (
      <Card>
        <CardTitle>
          <Skeleton size="md" />
        </CardTitle>
        <CardBody>
          <Skeleton size="lg" />
        </CardBody>
        <CardFooter>
          <Skeleton size="md" />
        </CardFooter>
      </Card>
    ) : (
      <Card>
        { clusterGroupUsers.error && (
        <ErrorBox message="Error getting cluster users" response={clusterGroupUsers} />
        )}
        <CardBody>
          <Title className="card-title" headingLevel="h3" size="lg">Cluster administrative users</Title>
          <p>
            Grant permission to manage this cluster to users defined in your identity provider.
            {' '}
            <ExternalLink href={links.OSD_DEDICATED_ADMIN_ROLE}>Learn more.</ExternalLink>
          </p>
          { addUserResponse.error && (
            <ErrorBox message="Error adding user" response={addUserResponse} />
          )}
          { deleteUserResponse.error && (
            <ErrorBox message="Error deleting user" response={deleteUserResponse} />
          )}
          { hasUsers && (
            <Table aria-label="Users" actions={actions} variant={TableVariant.compact} cells={columns} rows={rows} areActionsDisabled={() => !!disableReason}>
              <TableHeader />
              <TableBody />
            </Table>
          )}
          {addUserBtn}
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
  hasUsers: PropTypes.bool.isRequired,
  clusterHibernating: PropTypes.bool.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
};

export default UsersSection;
