import { connect } from 'react-redux';
import { getIsManual, getClusterAcks } from '../UpgradeAcknowledge/UpgradeAcknowledgeSelectors';

import {
  getEnableMinorVersionUpgrades,
  isNextMinorVersionAvailable,
} from '../MinorVersionUpgradeAlert/MinorVersionUpgradeSelectors';
import MinorVersionUpgradeConfirm from './MinorVersionUpgradeConfirm';

const mapStateToProps = (state) => ({
  isAutomatic: !getIsManual(state),
  isMinorVersionUpgradesEnabled: getEnableMinorVersionUpgrades(state),
  isNextMinorVersionAvailable: isNextMinorVersionAvailable(state),
  getAcks: getClusterAcks(state),
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(MinorVersionUpgradeConfirm);
