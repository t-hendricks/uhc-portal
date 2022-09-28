import { connect } from 'react-redux';
import {
  getSchedules,
  clearSchedulesResponse,
} from '../../../../common/Upgrades/clusterUpgradeActions';
import { openModal } from '../../../../../common/Modal/ModalActions';

import ClusterVersionInfo from './ClusterVersionInfo';

const mapStateToProps = (state) => ({
  versionInfo: state.clusterUpgrades.versionInfo,
  schedules: state.clusterUpgrades.schedules,
});

const mapDispatchToProps = (dispatch) => ({
  getSchedules: (clusterID) => dispatch(getSchedules(clusterID)),
  clearSchedulesResponse: () => dispatch(clearSchedulesResponse()),
  // explicit dispatching is annoying, but is a must when using openModal
  // TODO fix openModal so explicit dispatching won't be necessary, like all other actions
  openModal: (name, data) => dispatch(openModal(name, data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ClusterVersionInfo);
