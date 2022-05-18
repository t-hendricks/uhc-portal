import { connect } from 'react-redux';
import {
  getIsManual,
  getHasUnMetClusterAcks,
  getClusterIdFromState,
} from '../UpgradeAcknowledge/UpgradeAcknowledgeSelectors';
import { setAutomaticUpgradePolicy } from '../clusterUpgradeActions';
import {
  getEnableMinorVersionUpgrades, getUpgradeScheduleId, isNextMinorVersionAvailable, isRosa,
} from './MinorVersionUpgradeSelectors';
import MinorVersionUpgradeAlert from './MinorVersionUpgradeAlert';

const mapStateToProps = state => ({
  isAutomatic: !getIsManual(state),
  hasUnmetUpgradeAcknowledge: getHasUnMetClusterAcks(state),
  isMinorVersionUpgradesEnabled: getEnableMinorVersionUpgrades(state),
  automaticUpgradePolicyId: getUpgradeScheduleId(state),
  clusterId: getClusterIdFromState(state),
  isNextMinorVersionAvailable: isNextMinorVersionAvailable(state),
  isRosa: isRosa(state),
});

const mapDispatchToProps = dispatch => ({
  setUpgradePolicy: upgradePolicy => dispatch(setAutomaticUpgradePolicy(upgradePolicy)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MinorVersionUpgradeAlert);
