import { connect } from 'react-redux';

import {
  toggleSubscriptionReleased,
  clearToggleSubscriptionReleasedResponse,
} from './subscriptionReleasedActions';
import TransferClusterOwnershipDialog from './TransferClusterOwnershipDialog';
import { closeModal } from '../../../common/Modal/ModalActions';
import getClusterName from '../../../../common/getClusterName';

const mapStateToProps = (state) => ({
  subscription: state.modal.data.subscription,
  requestState: state.subscriptionReleased.requestState,
  shouldDisplayClusterName: state.modal.data.shouldDisplayClusterName || false,
  clusterDisplayName: getClusterName(state.modal.data),
});

const mapDispatchToProps = (dispatch) => ({
  submit: (subscriptionID, released) => {
    dispatch(toggleSubscriptionReleased(subscriptionID, released));
  },
  closeModal: () => {
    dispatch(clearToggleSubscriptionReleasedResponse());
    dispatch(closeModal());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TransferClusterOwnershipDialog);
