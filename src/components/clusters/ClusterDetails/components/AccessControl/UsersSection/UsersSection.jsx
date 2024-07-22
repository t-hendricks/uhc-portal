import React from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  EmptyState,
  Icon,
  Popover,
  PopoverPosition,
  Title,
} from '@patternfly/react-core';
import { HelpIcon } from '@patternfly/react-icons/dist/esm/icons/help-icon';
import {
  ActionsColumn,
  Table,
  TableVariant,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@patternfly/react-table';
import Skeleton from '@redhat-cloud-services/frontend-components/Skeleton';

import links from '../../../../../../common/installLinks.mjs';
import ButtonWithTooltip from '../../../../../common/ButtonWithTooltip';
import ErrorBox from '../../../../../common/ErrorBox';
import ExternalLink from '../../../../../common/ExternalLink';

import AddUserDialog from './AddUserDialog';

class UsersSection extends React.Component {
  state = {
    deletedRowIndex: null,
  };

  componentDidMount() {
    const { clusterGroupUsers, cluster, getUsers } = this.props;
    if (clusterGroupUsers.clusterID !== cluster.id || !clusterGroupUsers.pending) {
      getUsers();
    }
  }

  componentDidUpdate(prevProps) {
    const { deleteUserResponse, addUserResponse, getUsers, clusterGroupUsers } = this.props;
    const { deletedRowIndex } = this.state;

    // fetch users again if we just added/deleted a user.
    if (
      ((deleteUserResponse.fulfilled && prevProps.deleteUserResponse.pending) ||
        (addUserResponse.fulfilled && prevProps.addUserResponse.pending)) &&
      !clusterGroupUsers.pending
    ) {
      getUsers();
    }
    if (
      prevProps.clusterGroupUsers.pending &&
      clusterGroupUsers.fulfilled &&
      deletedRowIndex !== null
    ) {
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

    if (!hasUsers && clusterGroupUsers.error) {
      return (
        <EmptyState>
          <ErrorBox message="Error getting cluster users" response={clusterGroupUsers} />
        </EmptyState>
      );
    }

    const showSkeleton = !hasUsers && clusterGroupUsers.pending;

    const readOnlyReason = isReadOnly && 'This operation is not available during maintenance';
    const hibernatingReason =
      clusterHibernating && 'This operation is not available while cluster is hibernating';
    const canNotEditReason =
      !cluster.canEdit &&
      'You do not have permission to add a user. Only cluster owners, cluster editors, and Organization Administrators can add users.';
    const disableReason = readOnlyReason || hibernatingReason || canNotEditReason;

    const addUserBtn = (
      <ButtonWithTooltip
        onClick={() => {
          setTimeout(() => openModal('add-user'), 0);
        }}
        variant="secondary"
        className="access-control-add"
        disableReason={disableReason}
      >
        Add user
      </ButtonWithTooltip>
    );

    const columnNames = {
      userId: 'User ID',
      group: 'Group',
    };

    const userIdHeading = (
      <>
        {columnNames.userId}
        <Popover
          position={PopoverPosition.top}
          aria-label="User IDs"
          bodyContent={<p>User IDs are matched by the cluster&apos;s identity providers.</p>}
        >
          <Button variant="plain" isInline aria-label="Help">
            <Icon size="md">
              <HelpIcon />
            </Icon>
          </Button>
        </Popover>
      </>
    );

    const groupHeading = (
      <>
        {columnNames.group}
        <Popover
          position={PopoverPosition.top}
          aria-label="Groups"
          bodyContent={
            <p>
              Groups are mapped to role bindings on the cluster. For more information check the{' '}
              <ExternalLink href={links.UNDERSTANDING_AUTHENTICATION}>
                OpenShift 4 documentation
              </ExternalLink>
            </p>
          }
        >
          <Button variant="plain" isInline aria-label="Help">
            <Icon size="md">
              <HelpIcon />
            </Icon>
          </Button>
        </Popover>
      </>
    );

    const userRow = (user, index) =>
      deletedRowIndex === index ? (
        <Tr key={user.id}>
          <Td dataLabel={columnNames.userId}>
            <Skeleton size="md" />
          </Td>
          <Td dataLabel={columnNames.group}>
            <Skeleton size="md" />
          </Td>
          <Td isActionCell />
        </Tr>
      ) : (
        <Tr key={user.id}>
          <Td dataLabel={columnNames.userId}>{user.id}</Td>
          <Td dataLabel={columnNames.group}>{user.group}</Td>
          <Td isActionCell>
            <ActionsColumn
              items={[
                {
                  title: 'Delete',
                  onClick: () => {
                    this.setState({ deletedRowIndex: index });
                    deleteUser(cluster.id, user.group, user.id);
                  },
                },
              ]}
              isDisabled={!!disableReason}
            />
          </Td>
        </Tr>
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
        {clusterGroupUsers.error && (
          <ErrorBox message="Error getting cluster users" response={clusterGroupUsers} />
        )}
        <CardBody>
          <Title className="card-title" headingLevel="h3" size="lg">
            Cluster administrative users
          </Title>
          <p>
            Grant permission to manage this cluster to users defined in your identity provider.{' '}
            <ExternalLink href={links.OSD_DEDICATED_ADMIN_ROLE}>Learn more.</ExternalLink>
          </p>
          {addUserResponse.error && (
            <ErrorBox message="Error adding user" response={addUserResponse} />
          )}
          {deleteUserResponse.error && (
            <ErrorBox message="Error deleting user" response={deleteUserResponse} />
          )}
          {hasUsers && (
            <Table aria-label="Users" variant={TableVariant.compact}>
              <Thead>
                <Tr>
                  <Th>{userIdHeading}</Th>
                  <Th>{groupHeading}</Th>
                  <Th screenReaderText="User action" />
                </Tr>
              </Thead>
              <Tbody>{clusterGroupUsers.users.map(userRow)}</Tbody>
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
