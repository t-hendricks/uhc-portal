import React from 'react';
import PropTypes from 'prop-types';
import { Table, TableBody, TableHeader, TableVariant } from '@patternfly/react-table';
import { EmptyState } from '@patternfly/react-core';
import ErrorBox from '../../../../../../common/ErrorBox';

class NotificationContactsCard extends React.Component {
  componentDidMount() {
    const { subscriptionID, notificationContacts, getNotificationContacts } = this.props;

    if (notificationContacts.subscriptionID !== subscriptionID || !notificationContacts.pending) {
      getNotificationContacts(subscriptionID);
    }
  }

  componentDidUpdate(prevProps) {
    const {
      subscriptionID,
      notificationContacts,
      deleteContactResponse,
      addContactResponse,
      getNotificationContacts,
      clearDeleteNotificationContacts,
      addNotificationToaster,
    } = this.props;

    if (addContactResponse.fulfilled && prevProps.addContactResponse.pending) {
      // Display notification after successful addition of notification contact
      const title =
        addContactResponse.count === 1
          ? 'Notification contact added successfully'
          : `${addContactResponse.count} notification contacts added successfully`;
      addNotificationToaster({
        variant: 'success',
        title,
        dismissDelay: 8000,
        dismissable: false,
      });
    }

    // fetch contacts again if we just added/deleted one.
    if (
      ((deleteContactResponse.fulfilled && prevProps.deleteContactResponse.pending) ||
        (addContactResponse.fulfilled && prevProps.addContactResponse.pending)) &&
      !notificationContacts.pending
    ) {
      clearDeleteNotificationContacts();
      getNotificationContacts(subscriptionID);
    }
  }

  componentWillUnmount() {
    const { clearNotificationContacts } = this.props;
    clearNotificationContacts();
  }

  render() {
    const {
      subscriptionID,
      isDisabled,
      hasContacts,
      notificationContacts,
      deleteContactResponse,
      deleteNotificationContact,
      clearDeleteNotificationContacts,
    } = this.props;

    if (!hasContacts) {
      return null;
    }

    const columns = [
      { title: 'Username' },
      { title: 'Email' },
      { title: 'First Name' },
      { title: 'Last Name' },
    ];

    const actions = [
      {
        title: 'Delete',
        onClick: (_, rowID, rowData) => {
          clearDeleteNotificationContacts();
          deleteNotificationContact(subscriptionID, rowData.userID);
        },
        className: 'hand-pointer',
      },
    ];

    const userRow = (user) => ({
      cells: [user.username, user.email, user.firstName, user.lastName],
      userID: user.userID,
    });

    const rows = hasContacts ? notificationContacts.contacts.map(userRow) : [];

    return (
      <>
        {deleteContactResponse.error && (
          <EmptyState>
            <ErrorBox
              message="Error deleting Notification Contact"
              response={deleteContactResponse}
            />
          </EmptyState>
        )}
        <Table
          aria-label="Notification Contacts"
          actions={actions}
          variant={TableVariant.compact}
          cells={columns}
          rows={rows}
          areActionsDisabled={() => isDisabled}
        >
          <TableHeader />
          <TableBody />
        </Table>
      </>
    );
  }
}

NotificationContactsCard.propTypes = {
  subscriptionID: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  notificationContacts: PropTypes.object.isRequired,
  deleteContactResponse: PropTypes.object.isRequired,
  addContactResponse: PropTypes.object.isRequired,
  getNotificationContacts: PropTypes.func.isRequired,
  hasContacts: PropTypes.bool.isRequired,
  deleteNotificationContact: PropTypes.func.isRequired,
  clearDeleteNotificationContacts: PropTypes.func.isRequired,
  clearNotificationContacts: PropTypes.func.isRequired,
  addNotificationToaster: PropTypes.func.isRequired,
};

export default NotificationContactsCard;
