import { connect } from 'react-redux';

import { closeModal } from '../../../../common/Modal/ModalActions';
import { fetchClusterDetails } from '../../../../../redux/actions/clustersActions';
import { postSchedule, clearPostedUpgradeScheduleResponse } from '../clusterUpgradeActions';
import UpgradeWizard from './UpgradeWizard';
import { getClusterUnMetClusterAcks } from '../UpgradeAcknowledge/UpgradeAcknowledgeSelectors';
import {
  setClusterUpgradeGate,
  rejectGateAction,
} from '../../../../../redux/actions/upgradeGateActions';

const mapStateToProps = (state) => ({
  subscriptionID: state.modal.data.subscriptionID,
  clusterName: state.modal.data.clusterName,
  clusterDetails: state.clusters.details,
  upgradeScheduleRequest: state.clusterUpgrades.postedUpgradeSchedule,
  getUnMetClusterAcknowledgements: (toVersion) => getClusterUnMetClusterAcks(state, toVersion),
});

const mapDispatchToProps = {
  closeModal,
  postSchedule,
  clearPostedUpgradeScheduleResponse,
  fetchClusterDetails,
  setGate: setClusterUpgradeGate,
  rejectGate: rejectGateAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(UpgradeWizard);
