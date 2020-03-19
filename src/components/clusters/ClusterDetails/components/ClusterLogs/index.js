import { connect } from 'react-redux';

import ClusterLogs from './ClusterLogs';
import { clusterLogActions } from './clusterLogActions';
import { viewConstants } from '../../../../../redux/constants';
import { viewActions } from '../../../../../redux/actions/viewOptionsActions';

const getClusterHistory = (
  externalClusterID, queryObj,
) => clusterLogActions.getClusterHistory(externalClusterID, queryObj);

const mapDispatchToProps = {
  getClusterHistory,
  setSorting: sorting => viewActions.onListSortBy(sorting, viewConstants.CLUSTER_LOGS_VIEW),
  setListFlag: (key, value) => viewActions.onListFlagsSet(key, value,
    viewConstants.CLUSTER_LOGS_VIEW),
};

const mapStateToProps = state => ({
  clusterLogs: state.clusterLogs,
  viewOptions: state.viewOptions[viewConstants.CLUSTER_LOGS_VIEW],
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ClusterLogs);
