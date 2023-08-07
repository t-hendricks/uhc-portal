import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import map from 'lodash/map';
import get from 'lodash/get';
import { HelpIcon } from '@patternfly/react-icons';
import {
  Title,
  Button,
  Popover,
  PopoverPosition,
  Card,
  CardTitle,
  CardBody,
  CardFooter,
} from '@patternfly/react-core';
import { Table, TableHeader, TableBody, TableVariant } from '@patternfly/react-table';

import Skeleton from '@redhat-cloud-services/frontend-components/Skeleton';

import modals from '../../../../../common/Modal/modals';
import ErrorBox from '../../../../../common/ErrorBox';
import ButtonWithTooltip from '../../../../../common/ButtonWithTooltip';
import { OCMRolesRow } from './OCMRolesRow';
import { OCMRolesDialog } from './OCMRolesDialog';

function OCMRolesSection({
  subscription,
  canEditOCMRoles,
  canViewOCMRoles,
  canGrantClusterViewer,
  isOCMRolesDialogOpen,
  openModal,
  closeModal,
  modalData,
  getOCMRoles,
  grantOCMRole,
  editOCMRole,
  deleteOCMRole,
  getOCMRolesResponse,
  grantOCMRoleResponse,
  editOCMRoleResponse,
  deleteOCMRoleResponse,
  clearGetOCMRolesResponse,
  clearGrantOCMRoleResponse,
  clearEditOCMRoleResponse,
  clearDeleteOCMRoleResponse,
  refreshEvent = null,
}) {
  const [rows, setRows] = useState([]);
  const [pendingRowIndex, setPendingRowIndex] = useState(null);
  const [errorBox, setErrorBox] = useState(null);
  const [pageLoading, setPageLoading] = useState(null);
  const [disableReason, setDisableReason] = useState('');

  // showPendingRow replaces a row by a skeletonRow.
  // it hints the user the row is being modified.
  const showPendingRow = (rowIdx) => {
    if (rowIdx !== null && rowIdx >= 0 && rowIdx < rows.length) {
      const updatedRows = rows.slice();
      updatedRows[rowIdx].setIsPending(true);
      setPendingRowIndex(rowIdx);
      setRows(updatedRows);
    }
  };

  // clearPendingRow clears the pending row if it exists.
  const clearPendingRow = () => {
    if (pendingRowIndex !== null && pendingRowIndex >= 0 && pendingRowIndex < rows.length) {
      const pendingRow = rows[pendingRowIndex];
      const updatedRows = rows.slice();
      if (pendingRow.isCreating) {
        // remove the placeholder row for adding
        updatedRows.splice(pendingRowIndex, 1);
      } else {
        // switch back from the skeletonRow
        updatedRows[pendingRowIndex].setIsPending(false);
      }
      setRows(updatedRows);
    }
    setPendingRowIndex(null);
  };

  // handle mounted and unmounted
  useEffect(() => {
    // fetch roles when mounted.
    if (canViewOCMRoles) {
      setPageLoading(true);
      getOCMRoles(subscription.id);
    }

    if (!canViewOCMRoles) {
      setDisableReason(
        "You don't have permission to view user roles in your organization. Only the Cluster Owner, Cluster Editor, and the Organization Admin have the permission.",
      );
    } else if (!canEditOCMRoles) {
      setDisableReason(
        "You don't have permission to configure user roles in your organization. Only the Cluster Owner and the Organization Admin have the permission.",
      );
    } else {
      setDisableReason('');
    }

    return () => {
      // clear all when unmounted.
      clearGetOCMRolesResponse();
      clearGrantOCMRoleResponse();
      clearEditOCMRoleResponse();
      clearDeleteOCMRoleResponse();
    };
  }, [canViewOCMRoles, canEditOCMRoles, subscription.id]);

  // handle user clicked refresh
  useEffect(() => {
    if (canViewOCMRoles && get(refreshEvent, 'type') === 'clicked') {
      setPageLoading(true);
      getOCMRoles(subscription.id);
    }
  }, [refreshEvent]);

  // GET_OCM_ROLES
  useEffect(() => {
    if (getOCMRolesResponse.pending) {
      setErrorBox(null);
    } else if (getOCMRolesResponse.fulfilled) {
      // update the rows
      setPageLoading(null);
      const items = get(getOCMRolesResponse, 'data.items', []);
      const updatedRows = map(items, (item, rowIdx) => new OCMRolesRow(item, rowIdx));
      setRows(updatedRows);
      setErrorBox(null);
    } else if (getOCMRolesResponse.error) {
      // display error
      setPageLoading(null);
      setErrorBox(
        <ErrorBox message="Error getting OCM roles and access" response={getOCMRolesResponse} />,
      );
      clearPendingRow();
    }
  }, [getOCMRolesResponse]);

  // GRANT_OCM_ROLE
  useEffect(() => {
    if (grantOCMRoleResponse.pending) {
      setErrorBox(null);
    } else if (grantOCMRoleResponse.fulfilled) {
      // fetch roles again when a role has been added
      getOCMRoles(subscription.id);
      setErrorBox(null);
    } else if (grantOCMRoleResponse.error) {
      clearPendingRow();
    }
  }, [grantOCMRoleResponse]);

  // EDIT_OCM_ROLE
  useEffect(() => {
    if (editOCMRoleResponse.pending) {
      setErrorBox(null);
    } else if (editOCMRoleResponse.fulfilled) {
      // fetch roles again when a role has been added
      getOCMRoles(subscription.id);
      setErrorBox(null);
    } else if (editOCMRoleResponse.error) {
      // display error
      setErrorBox(
        <ErrorBox
          message="Error updating the access for the user"
          response={editOCMRoleResponse}
        />,
      );
      clearPendingRow();
    }
  }, [editOCMRoleResponse]);

  // DELETE_OCM_ROLE
  useEffect(() => {
    if (deleteOCMRoleResponse.pending) {
      setErrorBox(null);
    } else if (deleteOCMRoleResponse.fulfilled) {
      // fetch roles again when a role has been deleted
      getOCMRoles(subscription.id);
      setErrorBox(null);
    } else if (deleteOCMRoleResponse.error) {
      // display error
      setErrorBox(
        <ErrorBox
          message="Error removing the role from the user"
          response={deleteOCMRoleResponse}
        />,
      );
      clearPendingRow();
    }
  }, [deleteOCMRoleResponse]);

  const usernameHeader = (
    <>
      Username
      <Popover
        position={PopoverPosition.top}
        aria-label="Username"
        id="ocm-roles-section-username"
        bodyContent={
          <p>The username is the Red Hat login that is used to access the Red Hat account.</p>
        }
      >
        <Button variant="plain" isInline>
          <HelpIcon size="sm" />
        </Button>
      </Popover>
    </>
  );

  // TODO OCM RBAC phase: add the "learn more" link of links.OCM_DOCS_ROLES_AND_ACCESS
  const roleHeader = (
    <>
      Role
      <Popover
        position={PopoverPosition.top}
        aria-label="Role"
        id="ocm-roles-section-role"
        bodyContent={<p>The OpenShift Cluster Manager role that is granted to this user.</p>}
      >
        <Button variant="plain" isInline>
          <HelpIcon size="sm" />
        </Button>
      </Popover>
    </>
  );

  const columns = [
    { title: 'Username', transforms: [() => ({ children: usernameHeader })] },
    { title: 'Role', transforms: [() => ({ children: roleHeader })] },
  ];

  const handleGrantRoleButtonClick = () => {
    const rowIdx = rows.length;
    const row = new OCMRolesRow(null, rowIdx);
    setTimeout(() => openModal(modals.OCM_ROLES, row), 0);
  };

  const handleDeleteActionClick = (_, rowIdx, row) => {
    clearPendingRow();
    showPendingRow(rowIdx);
    deleteOCMRole(subscription.id, row.id);
  };

  const handleDialogSubmit = (row, username, roleID) => {
    clearPendingRow();
    if (row.isCreating) {
      grantOCMRole(subscription.id, username, roleID);
    } else {
      // TODO OCM RBAC phase 2: this could be handled by two APIs - delete then add.
      editOCMRole(subscription.id, row.id, roleID);
    }
  };

  const actions = [
    // TODO OCM RBAC phase 2: may rquire an Edit to change between editor or viewer
    /*
    {
      title: 'Edit role',
      onClick: (_, rowIdx, row) => { setTimeout(() => openModal(modals.OCM_ROLES, row), 0); },
      className: 'hand-pointer',
      itemKey: 'edit-acton',
    },
    */
    {
      title: 'Delete',
      onClick: handleDeleteActionClick,
      className: 'hand-pointer',
      itemKey: 'delete-acton',
    },
  ];

  return pageLoading ? (
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
      <CardBody>
        <Title className="card-title" headingLevel="h3" size="lg">
          OCM Roles and Access
        </Title>
        <p>
          Allow users in your organization to edit clusters. These permissions only apply to cluster
          management in OpenShift Cluster Manager.
        </p>
        <ButtonWithTooltip
          onClick={handleGrantRoleButtonClick}
          variant="secondary"
          className="access-control-add"
          disableReason={disableReason}
          data-testid="grant-role-btn"
        >
          Grant role
        </ButtonWithTooltip>
      </CardBody>
      <CardBody>
        {errorBox}
        <Table
          aria-label="OCM Roles and Access"
          actions={actions}
          variant={TableVariant.compact}
          cells={columns}
          rows={rows}
          areActionsDisabled={() => !!disableReason}
        >
          <TableHeader />
          <TableBody />
        </Table>
        <OCMRolesDialog
          isOpen={isOCMRolesDialogOpen}
          closeModal={closeModal}
          onSubmit={handleDialogSubmit}
          canGrantClusterViewer={canGrantClusterViewer}
          clearGrantOCMRoleResponse={clearGrantOCMRoleResponse}
          grantOCMRoleResponse={grantOCMRoleResponse}
          row={modalData}
        />
      </CardBody>
    </Card>
  );
}

OCMRolesSection.propTypes = {
  subscription: PropTypes.object.isRequired,
  canEditOCMRoles: PropTypes.bool.isRequired,
  canViewOCMRoles: PropTypes.bool.isRequired,
  canGrantClusterViewer: PropTypes.bool.isRequired,
  isOCMRolesDialogOpen: PropTypes.bool.isRequired,
  openModal: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  modalData: PropTypes.object.isRequired,
  getOCMRoles: PropTypes.func.isRequired,
  grantOCMRole: PropTypes.func.isRequired,
  editOCMRole: PropTypes.func.isRequired,
  deleteOCMRole: PropTypes.func.isRequired,
  getOCMRolesResponse: PropTypes.object.isRequired,
  grantOCMRoleResponse: PropTypes.object,
  editOCMRoleResponse: PropTypes.object,
  deleteOCMRoleResponse: PropTypes.object,
  clearGetOCMRolesResponse: PropTypes.func.isRequired,
  clearGrantOCMRoleResponse: PropTypes.func.isRequired,
  clearEditOCMRoleResponse: PropTypes.func.isRequired,
  clearDeleteOCMRoleResponse: PropTypes.func.isRequired,
  refreshEvent: PropTypes.object,
};

export default OCMRolesSection;
