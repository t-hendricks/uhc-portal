import { connect } from 'react-redux';

import UpgradeAcknowledgeModal from './UpgradeAcknowledgeModal';
import shouldShowModal from '../../../../../common/Modal/ModalSelectors';
import { modalActions } from '../../../../../common/Modal/ModalActions';
import { getModalDataFromState, getAutomaticUpgradePolicyId } from '../UpgradeAcknowledgeSelectors';
import { setClusterUpgradeGate } from '../../../../../../redux/actions/upgradeGateActions';
import { setAutomaticUpgradePolicy } from '../../clusterUpgradeActions';

const mapStateToProps = state => ({
  isOpen: shouldShowModal(state, 'ack-upgrade'),
  modalData: getModalDataFromState(state),
  automaticUpgradePolicyId: getAutomaticUpgradePolicyId(state),
});

const mapDispatchToProps = dispatch => ({
  closeModal: () => dispatch(modalActions.closeModal()),
  setGate: upgradeUpdateId => dispatch(setClusterUpgradeGate(upgradeUpdateId)),
  setUpgradePolicy: upgradePolicy => dispatch(setAutomaticUpgradePolicy(upgradePolicy)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UpgradeAcknowledgeModal);
