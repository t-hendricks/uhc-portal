import { connect } from 'react-redux';

import {
  editSubscriptionSettings,
  clearEditSubscriptionSettingsResponse,
} from '../../../../redux/actions/subscriptionSettingsActions';
import EditSubscriptionSettingsDialog from './EditSubscriptionSettingsDialog';
import { closeModal } from '../../../common/Modal/ModalActions';
import shouldShowModal from '../../../common/Modal/ModalSelectors';


const mapStateToProps = state => ({
  isOpen: shouldShowModal(state, 'edit-subscription-settings'),
  subscription: state.modal.data,
  requestState: state.subscriptionSettings.requestState,
});

const mapDispatchToProps = dispatch => ({
  submit: (subscriptionID, updates) => {
    const requestData = updates;
    if (updates.socket_total) {
      requestData.socket_total = parseInt(updates.socket_total, 10);
    }
    if (updates.cpu_total) {
      requestData.cpu_total = parseInt(updates.cpu_total, 10);
    }
    dispatch(editSubscriptionSettings(subscriptionID, requestData));
  },
  closeModal: () => {
    dispatch(clearEditSubscriptionSettingsResponse());
    dispatch(closeModal());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(EditSubscriptionSettingsDialog);
