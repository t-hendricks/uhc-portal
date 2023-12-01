import { connect } from 'react-redux';
import { isHypershiftCluster } from '~/components/clusters/common/clusterStates';
import {
  getIsManual,
  getHasUnMetClusterAcks,
  getClusterIdFromState,
} from '../UpgradeAcknowledge/UpgradeAcknowledgeSelectors';
import { setAutomaticUpgradePolicy } from '../clusterUpgradeActions';
import {
  getEnableMinorVersionUpgrades,
  getUpgradeScheduleId,
  isNextMinorVersionAvailable,
  isRosa,
} from './MinorVersionUpgradeSelectors';
import MinorVersionUpgradeAlert from './MinorVersionUpgradeAlert';

const mapStateToProps = (state) => {
  const { cluster } = state.clusters.details;
  const isHypershift = isHypershiftCluster(cluster);

  return {
    isAutomatic: !getIsManual(state),
    hasUnmetUpgradeAcknowledge: getHasUnMetClusterAcks(state),
    isMinorVersionUpgradesEnabled: getEnableMinorVersionUpgrades(state),
    automaticUpgradePolicyId: getUpgradeScheduleId(state),
    clusterId: getClusterIdFromState(state),
    isNextMinorVersionAvailable: isNextMinorVersionAvailable(state),
    isRosa: isRosa(state),
    isHypershift,
  };
};

const mapDispatchToProps = (dispatch) => ({
  setUpgradePolicy: (upgradePolicy) => dispatch(setAutomaticUpgradePolicy(upgradePolicy)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MinorVersionUpgradeAlert);
