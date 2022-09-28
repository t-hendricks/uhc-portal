import { connect } from 'react-redux';

import { closeModal } from '../../../../../../common/Modal/ModalActions';
import AddNotificationContactDialog from './AddNotificationContactDialog';
import supportActions from '../../SupportActions';
import shouldShowModal from '../../../../../../common/Modal/ModalSelectors';

const mapStateToProps = (state) => {
  const { cluster } = state.clusters.details;
  const { addContactResponse } = state.clusterSupport;

  return {
    subscriptionID: cluster.subscription?.id,
    isAddNotificationContactModalOpen: shouldShowModal(state, 'add-notification-contact'),
    addContactResponse,
  };
};

const mapDispatchToProps = (dispatch) => ({
  closeModal: () => dispatch(closeModal()),
  clearAddNotificationContacts: () => dispatch(supportActions.clearAddNotificationContacts()),
  addNotificationContact: (clusterID, username) =>
    dispatch(supportActions.addNotificationContact(clusterID, username)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddNotificationContactDialog);
