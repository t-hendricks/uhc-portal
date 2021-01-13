import { connect } from 'react-redux';

import { closeModal } from '../../../../common/Modal/ModalActions';
import { postSchedule, clearPostedUpgradeScheduleResponse } from '../clusterUpgradeActions';
import UpgradeWizard from './UpgradeWizard';


const mapStateToProps = state => ({
  clusterID: state.modal.data.clusterID,
  clusterChannel: state.modal.data.clusterChannel,
  clusterName: state.modal.data.clusterName,
  clusterVersion: state.modal.data.clusterVersion,
  upgradeScheduleRequest: state.clusterUpgrades.postedUpgradeSchedule,
});

const mapDispatchToProps = {
  closeModal,
  postSchedule,
  clearPostedUpgradeScheduleResponse,
};

export default connect(mapStateToProps, mapDispatchToProps)(UpgradeWizard);
