import { connect } from 'react-redux';
import { getVersion, getSchedules } from '../../../../common/Upgrades/clusterUpgradeActions';
import { openModal } from '../../../../../common/Modal/ModalActions';

import ClusterVersionInfo from './ClusterVersionInfo';


const mapStateToProps = state => ({
  versionInfo: state.clusterUpgrades.versionInfo,
  schedules: state.clusterUpgrades.schedules,
});

const mapDispatchToProps = dispatch => ({
  getVersion: (version, channel) => dispatch(getVersion(version, channel)),
  getSchedules: clusterID => dispatch(getSchedules(clusterID)),
  // explicit dispatching is annoying, but is a must when using openModal
  // TODO fix openModal so explicit dispatching won't be necessary, like all other actions
  openModal: (name, data) => dispatch(openModal(name, data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ClusterVersionInfo);
