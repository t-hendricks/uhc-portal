import { connect } from 'react-redux';

import { isHypershiftCluster } from '~/components/clusters/common/clusterStates';

import { setClusterUpgradeGate } from '../../../../../../redux/actions/upgradeGateActions';
import { modalActions } from '../../../../../common/Modal/ModalActions';
import shouldShowModal from '../../../../../common/Modal/ModalSelectors';
import { setAutomaticUpgradePolicy } from '../../clusterUpgradeActions';
import { getAutomaticUpgradePolicyId, getModalDataFromState } from '../UpgradeAcknowledgeSelectors';

import UpgradeAcknowledgeModal from './UpgradeAcknowledgeModal';

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
