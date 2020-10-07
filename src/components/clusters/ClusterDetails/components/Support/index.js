import { connect } from 'react-redux';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/cjs/actions';
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
    deleteContactResponse,
    addContactResponse,
  } = state.clusterSupport;

  return ({
    subscriptionID: cluster.subscription?.id,
    canEdit: cluster.canEdit,
    hasContacts: notificationContacts.contacts.length > 0,
    notificationContacts,
    addContactResponse,
    deleteContactResponse,
    isAddNotificationContactModalOpen: shouldShowModal(state, 'add-notification-contact'),
  });
};

const mapDispatchToProps = dispatch => ({
  clearNotificationContacts: () => dispatch(supportActions.clearNotificationContacts()),
  clearDeleteNotificationContacts: () => dispatch(supportActions.clearDeleteNotificationContacts()),
  getNotificationContacts: clusterID => dispatch(supportActions.getNotificationContacts(clusterID)),
  deleteNotificationContact: (clusterID, userID) => dispatch(
    supportActions.deleteNotificationContact(clusterID, userID),
  ),
  openModal: modalId => dispatch(openModal(modalId)),
  addNotificationContact: (clusterID, username) => dispatch(
    supportActions.addNotificationContact(clusterID, username),
  ),
  addNotificationToaster: data => dispatch(addNotification(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Support);
