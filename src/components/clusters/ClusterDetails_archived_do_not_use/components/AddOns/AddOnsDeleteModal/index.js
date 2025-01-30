import { connect } from 'react-redux';

import { closeModal } from '../../../../../common/Modal/ModalActions';
import shouldShowModal from '../../../../../common/Modal/ModalSelectors';
import { addOnsActions, clearClusterAddOnsResponses } from '../AddOnsActions';

import AddOnsDeleteModal from './AddOnsDeleteModal';

const mapStateToProps = (state) => ({
  isOpen: shouldShowModal(state, 'add-ons-delete-modal'),
  modalData: state.modal.data,
  deleteClusterAddOnResponse: state.addOns.deleteClusterAddOnResponse,
});

const mapDispatchToProps = (dispatch) => ({
  deleteClusterAddOn: (clusterID, addOnID) =>
    dispatch(addOnsActions.deleteClusterAddOn(clusterID, addOnID)),
  closeModal: () => dispatch(closeModal()),
  clearClusterAddOnsResponses: () => dispatch(clearClusterAddOnsResponses()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddOnsDeleteModal);
