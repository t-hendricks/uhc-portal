import React from 'react';
import PropTypes from 'prop-types';
import {
  Card, CardBody, CardTitle, Title,
} from '@patternfly/react-core';

import NotificationContactsCard from './components/NotificationContactsSection';
import SupportCasesCard from './components/SupportCasesSection';
import AddNotificationContactSection from './components/AddNotificationContactButton';
import './Support.scss';


const clusterOwnerMsg = (clusterCreator) => {
  const clusterOwner = clusterCreator?.email;
  return clusterOwner ? (
    /* eslint-disable react/jsx-one-expression-per-line */
    <>
      <br />
      The cluster owner will always receive notifications, at email address
      &lt;{clusterOwner}&gt;
      , in addition to this list of notification contacts.
    </>
  ) : null;
};

const Support = ({
  clusterCreator,
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
  supportCases,
  getSupportCases,
}) => (
  <>
    <Card>
      <CardTitle>
        <Title headingLevel="h2" size="lg" className="space-bottom-md card-title">Notification contacts</Title>
        <div className="support-subtitle">
          Add users to be contacted in the event of notifications about this cluster.
          {clusterOwnerMsg(clusterCreator)}
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
    <Card>
      <CardTitle>
        <Title headingLevel="h2" size="lg" className="card-title">Support cases</Title>
      </CardTitle>
      <CardBody>
        <SupportCasesCard
          subscriptionID={subscriptionID}
          supportCases={supportCases}
          getSupportCases={getSupportCases}
        />
      </CardBody>
    </Card>
  </>
);

Support.propTypes = {
  subscriptionID: PropTypes.string.isRequired,
  canEdit: PropTypes.bool.isRequired,
  clusterCreator: PropTypes.object.isRequired,
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
  supportCases: PropTypes.object.isRequired,
  getSupportCases: PropTypes.func.isRequired,
};

export default Support;
