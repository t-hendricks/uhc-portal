import { connect } from 'react-redux';
import get from 'lodash/get';

import ClusterLogsToolbar from './ClusterLogsToolbar';
import {
  onClearFiltersAndFlags,
  onListFilterSet,
  onListFlagsSet,
} from '../../../../../../redux/actions/viewOptionsActions';
import { viewConstants } from '../../../../../../redux/constants';

const mapStateToProps = (state, ownProps) => {
  const cluster = get(state, 'clusters.details.cluster', {});
  return {
    viewOptions: state.viewOptions[viewConstants.CLUSTER_LOGS_VIEW],
    currentFilter: state.viewOptions[ownProps.view].filter || { conditionalFilterFlags: {} },
    currentFlags: state.viewOptions[ownProps.view].flags.conditionalFilterFlags || {},
    createdAt: get(cluster, 'creation_timestamp', ''),
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  setFilter: (filter) => dispatch(onListFilterSet(filter, ownProps.view)),
  setFlags: (flags) => dispatch(onListFlagsSet('conditionalFilterFlags', flags, ownProps.view)),
  clearFiltersAndFlags: () => dispatch(onClearFiltersAndFlags(ownProps.view)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ClusterLogsToolbar);
