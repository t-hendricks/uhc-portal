import { connect } from 'react-redux';

import UpgradeAcknowledgeModal from './UpgradeAcknowledgeModal';
import shouldShowModal from '../../../../../common/Modal/ModalSelectors';
import { modalActions } from '../../../../../common/Modal/ModalActions';
import { getModalDataFromState } from '../UpgradeAcknowledgeSelectors';
import { setClusterUpgradeGate } from '../../../../../../redux/actions/upgradeGateActions';

const mapStateToProps = state => ({
  isOpen: shouldShowModal(state, 'ack-upgrade'),
  modalData: getModalDataFromState(state),
});

const mapDispatchToProps = {
  closeModal: modalActions.closeModal,
  setGate: setClusterUpgradeGate,
};

export default connect(mapStateToProps, mapDispatchToProps)(UpgradeAcknowledgeModal);
