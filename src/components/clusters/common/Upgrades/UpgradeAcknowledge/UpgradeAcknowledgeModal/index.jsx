import { connect } from 'react-redux';
import { isHypershiftCluster } from '~/components/clusters/common/clusterStates';
import UpgradeAcknowledgeModal from './UpgradeAcknowledgeModal';
import shouldShowModal from '../../../../../common/Modal/ModalSelectors';
import { modalActions } from '../../../../../common/Modal/ModalActions';
import { getModalDataFromState, getAutomaticUpgradePolicyId } from '../UpgradeAcknowledgeSelectors';
import { setClusterUpgradeGate } from '../../../../../../redux/actions/upgradeGateActions';
import { setAutomaticUpgradePolicy } from '../../clusterUpgradeActions';

const mapStateToProps = (state) => {
  const { cluster } = state.clusters.details;
  const isHypershift = isHypershiftCluster(cluster);

  return {
    isOpen: shouldShowModal(state, 'ack-upgrade'),
    modalData: getModalDataFromState(state),
    automaticUpgradePolicyId: getAutomaticUpgradePolicyId(state),
    isHypershift,
    isSTSEnabled: cluster?.aws?.sts?.enabled,
  };
};

const mapDispatchToProps = (dispatch) => ({
  closeModal: () => dispatch(modalActions.closeModal()),
  setGate: (upgradeUpdateId) => dispatch(setClusterUpgradeGate(upgradeUpdateId)),
  setUpgradePolicy: (upgradePolicy) => dispatch(setAutomaticUpgradePolicy(upgradePolicy)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UpgradeAcknowledgeModal);
