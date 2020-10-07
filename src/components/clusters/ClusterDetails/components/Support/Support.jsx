import React from 'react';
import PropTypes from 'prop-types';
import {
  Card, CardBody, CardTitle, Title,
} from '@patternfly/react-core';

import NotificationContactsCard from './components/NotificationContactsSection';
import AddNotificationContactSection from './components/AddNotificationContactButton';

const Support = ({
  subscriptionID,
  canEdit,
  openModal,
  notificationContacts,
  deleteContactResponse,
  addContactResponse,
  getNotificationContacts,
  hasContacts,
  deleteNotificationContact,
  clearDeleteNotificationContacts,
  clearNotificationContacts,
  addNotificationToaster,
}) => (
  <Card>
    <CardTitle>
      <Title headingLevel="h2" size="lg" className="card-title">Notification contacts</Title>
      <div className="support-subtitle">
        Add users to be contacted in the event of notifications about this cluster.
      </div>
    </CardTitle>
    <CardBody>
      <AddNotificationContactSection
        canEdit={canEdit}
        openModal={openModal}
      />
      <NotificationContactsCard
        subscriptionID={subscriptionID}
        canEdit={canEdit}
        notificationContacts={notificationContacts}
        deleteContactResponse={deleteContactResponse}
        addContactResponse={addContactResponse}
        getNotificationContacts={getNotificationContacts}
        hasContacts={hasContacts}
        deleteNotificationContact={deleteNotificationContact}
        clearDeleteNotificationContacts={clearDeleteNotificationContacts}
        clearNotificationContacts={clearNotificationContacts}
        addNotificationToaster={addNotificationToaster}
      />
    </CardBody>
  </Card>
);

Support.propTypes = {
  subscriptionID: PropTypes.string.isRequired,
  canEdit: PropTypes.bool.isRequired,
  notificationContacts: PropTypes.object.isRequired,
  deleteContactResponse: PropTypes.object.isRequired,
  addContactResponse: PropTypes.object.isRequired,
  getNotificationContacts: PropTypes.func.isRequired,
  hasContacts: PropTypes.bool.isRequired,
  deleteNotificationContact: PropTypes.func.isRequired,
  clearDeleteNotificationContacts: PropTypes.func.isRequired,
  clearNotificationContacts: PropTypes.func.isRequired,
  addNotificationToaster: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
};

export default Support;
