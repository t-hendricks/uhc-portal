import { connect } from 'react-redux';

import { fetchClusterDetails } from '../../../../../redux/actions/clustersActions';
import {
  rejectGateAction,
  setClusterUpgradeGate,
} from '../../../../../redux/actions/upgradeGateActions';
import { closeModal } from '../../../../common/Modal/ModalActions';
import { clearPostedUpgradeScheduleResponse, postSchedule } from '../clusterUpgradeActions';
import { getClusterUnMetClusterAcks } from '../UpgradeAcknowledge/UpgradeAcknowledgeSelectors';

import UpgradeWizard from './UpgradeWizard';

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
