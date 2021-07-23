import { connect } from 'react-redux';

import {
  editSubscriptionSettings,
  clearEditSubscriptionSettingsResponse,
} from '../../../../redux/actions/subscriptionSettingsActions';
import EditSubscriptionSettingsDialog from './EditSubscriptionSettingsDialog';
import { closeModal } from '../../../common/Modal/ModalActions';
import getClusterName from '../../../../common/getClusterName';

const mapStateToProps = state => ({
  subscription: state.modal.data.subscription,
  requestState: state.subscriptionSettings.requestState,
  shouldDisplayClusterName: state.modal.data.shouldDisplayClusterName || false,
  clusterDisplayName: getClusterName(state.modal.data),
});

const mapDispatchToProps = dispatch => ({
  submit: (subscriptionID, updates) => {
    const requestData = updates;
    if (updates.socket_total && updates.system_units === 'Sockets') {
      requestData.socket_total = parseInt(updates.socket_total, 10);
      requestData.cpu_total = requestData.socket_total;
    }
    if (updates.cpu_total && updates.system_units === 'Cores/vCPU') {
      requestData.cpu_total = parseInt(updates.cpu_total, 10);
      requestData.socket_total = 1;
    }
    dispatch(editSubscriptionSettings(subscriptionID, requestData));
  },
  closeModal: () => {
    dispatch(clearEditSubscriptionSettingsResponse());
    dispatch(closeModal());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(EditSubscriptionSettingsDialog);
