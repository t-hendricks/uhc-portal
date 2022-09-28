import { connect } from 'react-redux';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
import supportActions from '../../SupportActions';
import NotificationContactsCard from './NotificationContactsCard';

const mapStateToProps = (state) => {
  const { cluster } = state.clusters.details;
  const {
    notificationContacts = {
      contacts: [],
      pending: false,
      subscriptionID: '',
    },
    deleteContactResponse,
    addContactResponse,
  } = state.clusterSupport;

  return {
    subscriptionID: cluster.subscription?.id,
    canEdit: cluster.canEdit,
    hasContacts: notificationContacts.contacts.length > 0,
    notificationContacts,
    addContactResponse,
    deleteContactResponse,
  };
};

const mapDispatchToProps = (dispatch) => ({
  clearNotificationContacts: () => dispatch(supportActions.clearNotificationContacts()),
  clearDeleteNotificationContacts: () => dispatch(supportActions.clearDeleteNotificationContacts()),
  getNotificationContacts: (clusterID) =>
    dispatch(supportActions.getNotificationContacts(clusterID)),
  deleteNotificationContact: (clusterID, userID) =>
    dispatch(supportActions.deleteNotificationContact(clusterID, userID)),
  addNotification: (data) => dispatch(addNotification(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NotificationContactsCard);
