import { connect } from 'react-redux';

import { isHypershiftCluster } from '~/components/clusters/common/clusterStates';

import { setAutomaticUpgradePolicy } from '../clusterUpgradeActions';
import {
  getClusterIdFromState,
  getHasUnMetClusterAcks,
  getIsManual,
} from '../UpgradeAcknowledge/UpgradeAcknowledgeSelectors';

import MinorVersionUpgradeAlert from './MinorVersionUpgradeAlert';
import {
  getEnableMinorVersionUpgrades,
  getUpgradeScheduleId,
  isNextMinorVersionAvailable,
  isRosa,
} from './MinorVersionUpgradeSelectors';

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
    isSTSEnabled: cluster?.aws?.sts?.enabled,
  };
};

const mapDispatchToProps = (dispatch) => ({
  setUpgradePolicy: (upgradePolicy) => dispatch(setAutomaticUpgradePolicy(upgradePolicy)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MinorVersionUpgradeAlert);
