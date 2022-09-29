import { connect } from 'react-redux';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
import { openModal } from '../../../../common/Modal/ModalActions';
import shouldShowModal from '../../../../common/Modal/ModalSelectors';
import supportActions from './SupportActions';

import Support from './Support';

const mapStateToProps = (state) => {
  const { cluster } = state.clusters.details;
  const {
    notificationContacts = {
      contacts: [],
      pending: false,
      subscriptionID: '',
    },
    supportCases = {
      cases: [],
      pending: false,
      subscriptionID: '',
    },
    deleteContactResponse,
    addContactResponse,
  } = state.clusterSupport;

  return {
    clusterCreator: cluster.subscription?.creator,
    subscriptionID: cluster.subscription?.id,
    canEdit: cluster.canEdit,
    hasContacts: notificationContacts.contacts.length > 0,
    notificationContacts,
    addContactResponse,
    deleteContactResponse,
    isAddNotificationContactModalOpen: shouldShowModal(state, 'add-notification-contact'),
    supportCases,
  };
};

const mapDispatchToProps = (dispatch) => ({
  clearNotificationContacts: () => dispatch(supportActions.clearNotificationContacts()),
  clearDeleteNotificationContacts: () => dispatch(supportActions.clearDeleteNotificationContacts()),
  getNotificationContacts: (subscriptionID) =>
    dispatch(supportActions.getNotificationContacts(subscriptionID)),
  deleteNotificationContact: (subscriptionID, userID) =>
    dispatch(supportActions.deleteNotificationContact(subscriptionID, userID)),
  openModal: (modalId) => dispatch(openModal(modalId)),
  addNotificationContact: (subscriptionID, username) =>
    dispatch(supportActions.addNotificationContact(subscriptionID, username)),
  addNotificationToaster: (data) => dispatch(addNotification(data)),
  getSupportCases: (subscriptionID) => dispatch(supportActions.getSupportCases(subscriptionID)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Support);
