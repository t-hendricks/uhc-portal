import { connect } from 'react-redux';
import { getVersion } from '../../../../common/Upgrades/clusterUpgradeActions';
import { openModal } from '../../../../../common/Modal/ModalActions';

import ClusterVersionInfo from './ClusterVersionInfo';


const mapStateToProps = state => ({
  versionInfo: state.clusterUpgrades.versionInfo,
});

const mapDispatchToProps = {
  getVersion,
  openModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(ClusterVersionInfo);
