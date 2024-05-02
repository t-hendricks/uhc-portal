import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getClusterAddOns } from '../../ClusterDetails/components/AddOns/AddOnsActions';
import { getLogs } from '../../ClusterDetails/components/Overview/InstallationLogView/InstallationLogActions';

import UninstallProgress from './UninstallProgress';

const mapStateToProps = (state) => ({
  clusterAddOns: state.addOns.clusterAddOns,
  addOns: state.addOns.addOns,
  logs: state.logs,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      getClusterAddOns,
      getLogs,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(UninstallProgress);
