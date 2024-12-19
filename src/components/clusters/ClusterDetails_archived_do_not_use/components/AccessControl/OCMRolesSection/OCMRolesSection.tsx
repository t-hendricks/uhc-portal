import React, { ReactNode, useEffect, useState } from 'react';
import get from 'lodash/get';
import map from 'lodash/map';
import { useDispatch } from 'react-redux';

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  Icon,
  Popover,
  PopoverPosition,
  Title,
} from '@patternfly/react-core';
import { HelpIcon } from '@patternfly/react-icons/dist/esm/icons/help-icon';
import {
  ActionsColumn,
  IRowCell,
  Table,
  TableVariant,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@patternfly/react-table';
import Skeleton from '@redhat-cloud-services/frontend-components/Skeleton';

import { useGlobalState } from '~/redux/hooks';
import { Subscription } from '~/types/accounts_mgmt.v1';

import OCMRolesActions from '../../../../../../redux/actions/OCMRolesActions';
import ButtonWithTooltip from '../../../../../common/ButtonWithTooltip';
import ErrorBox from '../../../../../common/ErrorBox';
import { openModal } from '../../../../../common/Modal/ModalActions';
import modals from '../../../../../common/Modal/modals';
import { eventTypes } from '../../../clusterDetailsHelper';

import { OCMRolesDialog, OCMRolesDialogProps } from './OCMRolesDialog';
import { OCMRolesRow } from './OCMRolesRow';

type OCMRolesSectionProps = {
  subscription: Subscription;
  canEditOCMRoles: boolean;
  canViewOCMRoles: boolean;
  refreshEvent?: object;
};

function OCMRolesSection({
  subscription,
  canEditOCMRoles,
  canViewOCMRoles,
  refreshEvent,
}: OCMRolesSectionProps) {
  const [rows, setRows] = useState<OCMRolesRow[]>([]);
  const [pendingRowIndex, setPendingRowIndex] = useState<number>(-1);
  const [errorBox, setErrorBox] = useState<ReactNode>(null);
  const [pageLoading, setPageLoading] = useState(false);
  const [disableReason, setDisableReason] = useState('');
  const { data: modalData } = useGlobalState((state) => state.modal);
  const { getOCMRolesResponse, grantOCMRoleResponse, deleteOCMRoleResponse } = useGlobalState(
    (state) => state.ocmRoles,
  );

  const productId = subscription?.plan?.id;

  const dispatch = useDispatch();

  // showPendingRow replaces a row by a skeletonRow.
  // it hints the user the row is being modified.
  const showPendingRow = (rowIdx: number) => {
    if (rowIdx !== null && rowIdx >= 0 && rowIdx < rows.length) {
      const updatedRows = rows.slice();
      updatedRows[rowIdx].setIsPending(true);
      setPendingRowIndex(rowIdx);
      setRows(updatedRows);
    }
  };

  // clearPendingRow clears the pending row if it exists.
  const clearPendingRow = () => {
    if (pendingRowIndex >= 0 && pendingRowIndex < rows.length) {
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
    setPendingRowIndex(-1);
  };

  // handle mounted and unmounted
  useEffect(() => {
    // fetch roles when mounted.
    if (canViewOCMRoles && subscription.id) {
      setPageLoading(true);
      dispatch(OCMRolesActions.getOCMRoles(subscription.id));
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
      dispatch(OCMRolesActions.clearGetOCMRolesResponse());
      dispatch(OCMRolesActions.clearGrantOCMRoleResponse());
      dispatch(OCMRolesActions.clearDeleteOCMRoleResponse());
    };
  }, [canViewOCMRoles, canEditOCMRoles, subscription.id, dispatch]);

  // handle user clicked refresh
  useEffect(() => {
    if (canViewOCMRoles && get(refreshEvent, 'type') === eventTypes.CLICKED && subscription.id) {
      setPageLoading(true);
      dispatch(OCMRolesActions.getOCMRoles(subscription.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshEvent]);

  // GET_OCM_ROLES
  useEffect(() => {
    if (getOCMRolesResponse.pending) {
      setErrorBox(null);
    } else if (getOCMRolesResponse.fulfilled) {
      // update the rows
      setPageLoading(false);
      const items = getOCMRolesResponse?.data.items ?? [];
      const updatedRows = map(items, (item, rowIdx) => new OCMRolesRow(item, rowIdx));
      setRows(updatedRows);
      setErrorBox(null);
    } else if (getOCMRolesResponse.error) {
      // display error
      setPageLoading(false);
      setErrorBox(
        <ErrorBox message="Error getting OCM roles and access" response={getOCMRolesResponse} />,
      );
      clearPendingRow();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getOCMRolesResponse]);

  // GRANT_OCM_ROLE
  useEffect(() => {
    if (grantOCMRoleResponse.pending) {
      setErrorBox(null);
    } else if (grantOCMRoleResponse.fulfilled && subscription.id) {
      // fetch roles again when a role has been added
      dispatch(OCMRolesActions.getOCMRoles(subscription.id));
      setErrorBox(null);
    } else if (grantOCMRoleResponse.error) {
      clearPendingRow();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grantOCMRoleResponse]);

  // DELETE_OCM_ROLE
  useEffect(() => {
    if (deleteOCMRoleResponse.pending) {
      setErrorBox(null);
    } else if (deleteOCMRoleResponse.fulfilled && subscription.id) {
      // fetch roles again when a role has been deleted
      dispatch(OCMRolesActions.getOCMRoles(subscription.id));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteOCMRoleResponse]);

  const handleGrantRoleButtonClick = () => {
    const rowIdx = rows.length;
    const row = new OCMRolesRow(null, rowIdx.toString());
    setTimeout(() => dispatch(openModal(modals.OCM_ROLES, row)), 0);
  };

  const handleDialogSubmit: OCMRolesDialogProps['onSubmit'] = (row, username, roleID) => {
    clearPendingRow();
    if (row.isCreating && subscription.id) {
      dispatch(OCMRolesActions.grantOCMRole(subscription.id, username, roleID));
    } else {
      // TODO OCM RBAC phase 2: this could be handled by two APIs - delete then add.
    }
  };

  const columnNames = {
    username: 'Username',
    role: 'Role',
  };

  const usernameHeader = (
    <>
      {columnNames.username}
      <Popover
        position={PopoverPosition.top}
        aria-label="Username"
        id="ocm-roles-section-username"
        bodyContent={
          <p>The username is the Red Hat login that is used to access the Red Hat account.</p>
        }
      >
        <Button variant="plain" isInline>
          <Icon size="md">
            <HelpIcon />
          </Icon>
        </Button>
      </Popover>
    </>
  );

  // TODO OCM RBAC phase: add the "learn more" link of links.OCM_DOCS_ROLES_AND_ACCESS
  const roleHeader = (
    <>
      {columnNames.role}
      <Popover
        position={PopoverPosition.top}
        aria-label="Role"
        id="ocm-roles-section-role"
        bodyContent={<p>The OpenShift Cluster Manager role that is granted to this user.</p>}
      >
        <Button variant="plain" isInline>
          <Icon size="md">
            <HelpIcon />
          </Icon>
        </Button>
      </Popover>
    </>
  );

  const actions = (role: OCMRolesRow, rowIndex: number) => [
    // TODO OCM RBAC phase 2: may require an Edit to change between editor or viewer
    /*
    {
      title: 'Edit role',
      onClick: (_, rowIdx, row) => { setTimeout(() => dispatch(openModal(modals.OCM_ROLES, row)), 0); },
      className: 'hand-pointer',
      itemKey: 'edit-acton',
      isSeparator: false,
    },
    */
    {
      title: 'Delete',
      onClick: () => {
        clearPendingRow();
        if (subscription.id && role.id) {
          showPendingRow(rowIndex);
          dispatch(OCMRolesActions.deleteOCMRole(subscription.id, role.id));
        }
      },
    },
  ];

  const isIRowCell = (row: IRowCell | React.ReactNode): row is IRowCell =>
    (row as IRowCell).title !== undefined;

  const roleRow = (role: OCMRolesRow, index: number) => {
    const rowActions = actions(role, index);
    const { cellsData, usernameValue } = role;
    const username = isIRowCell(cellsData?.[0]) ? cellsData?.[0].title : cellsData?.[0];
    const roleLabel = isIRowCell(cellsData?.[1]) ? cellsData?.[1].title : cellsData?.[1];

    return role.isCreating || role.isPending ? (
      <Tr key={usernameValue}>
        <Td dataLabel={columnNames.username}>
          <Skeleton size="md" />
        </Td>
        <Td dataLabel={columnNames.role}>
          <Skeleton size="md" />
        </Td>
        <Td isActionCell />
      </Tr>
    ) : (
      <Tr key={usernameValue}>
        <Td dataLabel={columnNames.username}>{username as React.ReactNode}</Td>
        <Td dataLabel={columnNames.role}>{roleLabel as React.ReactNode}</Td>
        <Td isActionCell>
          <ActionsColumn items={rowActions} isDisabled={!!disableReason} />
        </Td>
      </Tr>
    );
  };

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
        <Table aria-label="OCM Roles and Access" variant={TableVariant.compact}>
          <Thead>
            <Tr>
              <Th>{usernameHeader}</Th>
              <Th>{roleHeader}</Th>
              <Th screenReaderText="Role action" />
            </Tr>
          </Thead>
          <Tbody>{rows.map(roleRow)}</Tbody>
        </Table>
        <OCMRolesDialog
          onSubmit={handleDialogSubmit}
          row={modalData as OCMRolesRow}
          productId={productId}
        />
      </CardBody>
    </Card>
  );
}

export default OCMRolesSection;
