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
    dispatch(editSubscriptionSettings(subscriptionID, updates));
  },
  closeModal: () => {
    dispatch(clearEditSubscriptionSettingsResponse());
    dispatch(closeModal());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(EditSubscriptionSettingsDialog);
