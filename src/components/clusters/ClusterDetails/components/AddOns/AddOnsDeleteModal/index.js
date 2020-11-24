import { connect } from 'react-redux';
import shouldShowModal from '../../../../../common/Modal/ModalSelectors';
import { closeModal } from '../../../../../common/Modal/ModalActions';
import AddOnsDeleteModal from './AddOnsDeleteModal';
import { addOnsActions } from '../AddOnsActions';


const mapStateToProps = state => ({
  isOpen: shouldShowModal(state, 'add-ons-delete-modal'),
  modalData: state.modal.data,
  deleteClusterAddOnResponse: state.addOns.deleteClusterAddOnResponse,
});

const mapDispatchToProps = {
  deleteClusterAddOn: (clusterID, addOnID) => addOnsActions.deleteClusterAddOn(clusterID, addOnID),
  closeModal: () => closeModal(),
  clearDeleteAddOnResponse: () => addOnsActions.clearClusterAddOnsResponses(),
};

export default connect(mapStateToProps, mapDispatchToProps)(AddOnsDeleteModal);
