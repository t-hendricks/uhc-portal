import { connect } from 'react-redux';

import {
  toggleSubscriptionReleased,
  clearToggleSubscriptionReleasedResponse,
} from './subscriptionReleasedActions';
import TransferClusterOwnershipDialog from './TransferClusterOwnershipDialog';
import { closeModal } from '../../../common/Modal/ModalActions';

const mapStateToProps = state => ({
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
