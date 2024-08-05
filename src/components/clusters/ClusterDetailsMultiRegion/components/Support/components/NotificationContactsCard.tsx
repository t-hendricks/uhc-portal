import React, { useEffect, useMemo } from 'react';
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
import { usePreviousProps } from '~/hooks/usePreviousProps';
import { useDeleteNotificationContact } from '~/queries/ClusterDetailsQueries/ClusterSupportTab/useDeleteNotificationContact';
import { useFetchNotificationContacts } from '~/queries/ClusterDetailsQueries/ClusterSupportTab/useFetchNotificationContacts';
import {
  buildNotificationsMeta,
  clearDeleteNotificationContacts,
} from '~/redux/actions/supportActions';
import { Contact } from '~/redux/reducers/supportReducer';
import { ErrorState } from '~/types/types';

type NotificationContactsCardProps = {
  subscriptionID: string;
  isDisabled: boolean;
  isAddNotificationContactSuccess: boolean;
  isAddNotificationContactPending: boolean;
  addNotificationStatus: string;
};

const NotificationContactsCard = ({
  subscriptionID,
  isDisabled,
  isAddNotificationContactPending,
  isAddNotificationContactSuccess,
  addNotificationStatus,
}: NotificationContactsCardProps) => {
  const dispatch = useDispatch();
  const { notificationContacts, refetch } = useFetchNotificationContacts(subscriptionID);
  const {
    mutate,
    isSuccess: isDeleteNotificationSuccess,
    isPending: isDeleteNotificationPending,
    isError: isDeleteNotificationError,
    error: deleteNotificationError,
  } = useDeleteNotificationContact(subscriptionID);

  const previousAddContactResponsePending = usePreviousProps(addNotificationStatus);
  const previousDeleteContactResponsePending = usePreviousProps(isDeleteNotificationPending);

  useEffect(() => {
    if (notificationContacts.subscriptionID !== subscriptionID || !notificationContacts.pending) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notificationContacts.subscriptionID, subscriptionID, refetch]);

  useEffect(() => {
    if (addNotificationStatus === 'success' && previousAddContactResponsePending === 'pending') {
      // Display notification after successful addition of notification contact
      const title = 'Notification contact added successfully';
      // TODO investigate why there even can be several notification contacts
      // const title =
      // addNotificationResponse === 1
      //     ? 'Notification contact added successfully'
      //     : `${addContactResponse.count} notification contacts added successfully`;

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
      ((isDeleteNotificationSuccess && previousDeleteContactResponsePending) ||
        (isAddNotificationContactSuccess && previousAddContactResponsePending)) &&
      !notificationContacts.pending
    ) {
      refetch();
    }
  }, [
    refetch,
    addNotificationStatus,
    isAddNotificationContactPending,
    isDeleteNotificationSuccess,
    isAddNotificationContactSuccess,
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
          mutate(rowData.userID);
          const title = 'Notification contact deleted successfully';
          if (!isDeleteNotificationError) {
            dispatch(
              addNotification({
                variant: 'success',
                title,
                dismissable: false,
              }),
            );
            buildNotificationsMeta('Notification contact deleted successfully', rowData.userID);
          }
        },
        className: 'hand-pointer',
      },
    ],
    [isDeleteNotificationError, dispatch, mutate],
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
      {isDeleteNotificationError && (
        <EmptyState>
          <ErrorBox
            message="Error deleting Notification Contact"
            response={deleteNotificationError.error as ErrorState}
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
