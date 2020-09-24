import { connect } from 'react-redux';
import { getVersion } from '../../clusterUpgradeActions';

import VersionSelectionGrid from './VersionSelectionGrid';


const mapStateToProps = state => ({
  versionInfo: state.clusterUpgrades.versionInfo,
});

const mapDispatchToProps = {
  getVersion,
};

export default connect(mapStateToProps, mapDispatchToProps)(VersionSelectionGrid);
