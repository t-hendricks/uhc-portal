import { connect } from 'react-redux';

import {
  toggleSubscriptionReleased,
  clearToggleSubscriptionReleasedResponse,
} from './subscriptionReleasedActions';
import TransferClusterOwnershipDialog from './TransferClusterOwnershipDialog';
import { closeModal } from '../../../common/Modal/ModalActions';
import shouldShowModal from '../../../common/Modal/ModalSelectors';


const mapStateToProps = state => ({
  isOpen: shouldShowModal(state, 'transfer-cluster-ownership'),
  subscription: state.modal.data,
  requestState: state.subscriptionReleased.requestState,
});

const mapDispatchToProps = dispatch => ({
  submit: (subscriptionID, released) => {
    dispatch(toggleSubscriptionReleased(subscriptionID, released));
  },
  closeModal: () => {
    dispatch(clearToggleSubscriptionReleasedResponse());
    dispatch(closeModal());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TransferClusterOwnershipDialog);
