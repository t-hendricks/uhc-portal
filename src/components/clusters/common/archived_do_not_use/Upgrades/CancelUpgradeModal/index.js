import { connect } from 'react-redux';

import { closeModal } from '../../../../../common/Modal/ModalActions';
import shouldShowModal from '../../../../../common/Modal/ModalSelectors';
import { clearDeleteScheduleResponse, deleteSchedule } from '../clusterUpgradeActions';

import CancelUpgradeModal from './CancelUpgradeModal';

const mapStateToProps = (state) => ({
  isOpen: shouldShowModal(state, 'cancel-upgrade'),
  schedule: state.modal.data.schedule,
  deleteScheduleRequest: state.clusterUpgrades.deleteScheduleRequest,
});

const mapDispatchToProps = {
  deleteSchedule,
  clearDeleteScheduleResponse,
  closeModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(CancelUpgradeModal);
