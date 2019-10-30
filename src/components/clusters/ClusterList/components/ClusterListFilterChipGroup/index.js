
import { connect } from 'react-redux';
import { onListFlagsSet } from '../../../../../redux/actions/viewOptionsActions';
import { viewConstants } from '../../../../../redux/constants';
import ClusterListFilterChipGroup from './ClusterListFilterChipGroup';

const mapStateToProps = state => ({
  currentFilters: state.viewOptions[viewConstants.CLUSTERS_VIEW].flags.subscriptionFilter || {},
});

const mapDispatchToProps = {
  setFilter: filter => onListFlagsSet('subscriptionFilter', filter, viewConstants.CLUSTERS_VIEW),
};

export default connect(mapStateToProps, mapDispatchToProps)(ClusterListFilterChipGroup);
