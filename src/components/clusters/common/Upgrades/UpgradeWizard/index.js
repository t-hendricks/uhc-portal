import { connect } from 'react-redux';

import { closeModal } from '../../../../common/Modal/ModalActions';
import { postSchedule } from '../clusterUpgradeActions';
import shouldShowModal from '../../../../common/Modal/ModalSelectors';
import UpgradeWizard from './UpgradeWizard';


const mapStateToProps = state => ({
  isOpen: shouldShowModal(state, 'upgrade-wizard'),
  clusterID: state.modal.data.clusterID,
  clusterChannel: state.modal.data.clusterChannel,
  clusterName: state.modal.data.clusterName,
  clusterVersion: state.modal.data.clusterVersion,
  upgradeScheduleRequest: state.clusterUpgrades.upgradeSchedule,
});

const mapDispatchToProps = {
  closeModal,
  postSchedule,
};

export default connect(mapStateToProps, mapDispatchToProps)(UpgradeWizard);
