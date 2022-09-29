import { connect } from 'react-redux';
import get from 'lodash/get';
import ClusterLogs from './ClusterLogs';
import { clusterLogActions } from './clusterLogActions';
import { viewConstants } from '~/redux/constants';
import { viewActions } from '~/redux/actions/viewOptionsActions';

const getClusterHistory = (externalClusterID, queryObj) =>
  clusterLogActions.getClusterHistory(externalClusterID, queryObj);

const mapDispatchToProps = {
  getClusterHistory,
  setSorting: (sorting) => viewActions.onListSortBy(sorting, viewConstants.CLUSTER_LOGS_VIEW),
  setListFlag: (key, value) =>
    viewActions.onListFlagsSet(key, value, viewConstants.CLUSTER_LOGS_VIEW),
  setFilter: (filter) => viewActions.onListFilterSet(filter, viewConstants.CLUSTER_LOGS_VIEW),
};

const mapStateToProps = (state) => {
  const cluster = get(state, 'clusters.details.cluster', {});
  return {
    clusterLogs: state.clusterLogs,
    viewOptions: state.viewOptions[viewConstants.CLUSTER_LOGS_VIEW],
    createdAt: get(cluster, 'creation_timestamp', ''),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ClusterLogs);
