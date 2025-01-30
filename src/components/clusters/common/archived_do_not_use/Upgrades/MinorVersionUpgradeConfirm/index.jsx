import { connect } from 'react-redux';

import {
  getEnableMinorVersionUpgrades,
  isNextMinorVersionAvailable,
} from '../MinorVersionUpgradeAlert/MinorVersionUpgradeSelectors';
import { getClusterAcks, getIsManual } from '../UpgradeAcknowledge/UpgradeAcknowledgeSelectors';

import MinorVersionUpgradeConfirm from './MinorVersionUpgradeConfirm';

const mapStateToProps = (state) => ({
  isAutomatic: !getIsManual(state),
  isMinorVersionUpgradesEnabled: getEnableMinorVersionUpgrades(state),
  isNextMinorVersionAvailable: isNextMinorVersionAvailable(state),
  getAcks: getClusterAcks(state),
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(MinorVersionUpgradeConfirm);
