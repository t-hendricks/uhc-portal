import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import { EmptyState } from '@patternfly/react-core';
import { IActions, IExtraData, IRowData, TableVariant } from '@patternfly/react-table';
import {
  Table as TableDeprecated,
  TableBody as TableBodyDeprecated,
  TableHeader as TableHeaderDeprecated,
} from '@patternfly/react-table/deprecated';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';

import ErrorBox from '~/components/common/ErrorBox';
import {
  clearDeleteNotificationContacts,
  clearNotificationContacts,
  deleteNotificationContact,
  getNotificationContacts,
} from '~/redux/actions/supportActions';
import { useGlobalState } from '~/redux/hooks';
import { Contact } from '~/redux/reducers/supportReducer';

type NotificationContactsCardProps = {
  subscriptionID: string;
  isDisabled: boolean;
};

const NotificationContactsCard = ({
  subscriptionID,
  isDisabled,
}: NotificationContactsCardProps) => {
  const dispatch = useDispatch();

  const { notificationContacts, addContactResponse, deleteContactResponse } = useGlobalState(
    (state) => state.clusterSupport,
  );

  const [previousAddContactResponsePending, setPreviousAddContactResponsePending] =
    useState<boolean>();
  const [previousDeleteContactResponsePending, setPreviousDeleteContactResponsePending] =
    useState<boolean>();

  useEffect(
    () => () => {
      dispatch(clearNotificationContacts());
    },
    [dispatch],
  );

  useEffect(() => {
    if (notificationContacts.subscriptionID !== subscriptionID || !notificationContacts.pending) {
      dispatch(getNotificationContacts(subscriptionID));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notificationContacts.subscriptionID, subscriptionID, dispatch]);

  useEffect(() => {
    if (addContactResponse.fulfilled && previousAddContactResponsePending) {
      // Display notification after successful addition of notification contact
      const title =
        addContactResponse.count === 1
          ? 'Notification contact added successfully'
          : `${addContactResponse.count} notification contacts added successfully`;

      dispatch(
        addNotification({
          variant: 'success',
          title,
          dismissable: false,
        }),
      );
    }

    // fetch contacts again if we just added/deleted one.
    if (
      ((deleteContactResponse.fulfilled && previousDeleteContactResponsePending) ||
        (addContactResponse.fulfilled && previousAddContactResponsePending)) &&
      !notificationContacts.pending
    ) {
      dispatch(clearDeleteNotificationContacts());
      dispatch(getNotificationContacts(subscriptionID));
    }
    setPreviousAddContactResponsePending(addContactResponse.pending);
    setPreviousDeleteContactResponsePending(deleteContactResponse.pending);
  }, [
    addContactResponse.count,
    addContactResponse.fulfilled,
    addContactResponse.pending,
    deleteContactResponse.fulfilled,
    deleteContactResponse.pending,
    dispatch,
    notificationContacts.pending,
    previousAddContactResponsePending,
    previousDeleteContactResponsePending,
    subscriptionID,
  ]);

  const actions: IActions = useMemo(
    () => [
      {
        title: 'Delete',
        onClick: (
          event: React.MouseEvent,
          rowIndex: number,
          rowData: IRowData,
          extraData: IExtraData,
        ) => {
          dispatch(clearDeleteNotificationContacts());
          dispatch(deleteNotificationContact(subscriptionID, rowData.userID));
        },
        className: 'hand-pointer',
      },
    ],
    [dispatch, subscriptionID],
  );

  const rows = useMemo(
    () =>
      notificationContacts.contacts?.map(
        ({ username, email, firstName, lastName, userID }: Contact) => ({
          cells: [username, email, firstName, lastName],
          userID,
        }),
      ),
    [notificationContacts.contacts],
  );

  return notificationContacts.contacts && notificationContacts.contacts.length ? (
    <>
      {deleteContactResponse.error && (
        <EmptyState>
          <ErrorBox
            message="Error deleting Notification Contact"
            response={deleteContactResponse}
          />
        </EmptyState>
      )}
      <TableDeprecated
        aria-label="Notification Contacts"
        actions={actions}
        variant={TableVariant.compact}
        cells={[
          { title: 'Username' },
          { title: 'Email' },
          { title: 'First Name' },
          { title: 'Last Name' },
        ]}
        rows={rows}
        areActionsDisabled={() => isDisabled}
      >
        <TableHeaderDeprecated />
        <TableBodyDeprecated />
      </TableDeprecated>
    </>
  ) : null;
};

export default NotificationContactsCard;
