
import { connect } from 'react-redux';
import { onListFlagsSet } from '../../../../../redux/actions/viewOptionsActions';
import { viewConstants } from '../../../../../redux/constants';
import ClusterListFilterDropdown from './ClusterListFilterDropdown';

const mapStateToProps = state => ({
  currentFilter: state.viewOptions[viewConstants.CLUSTERS_VIEW].flags.subscriptionFilter || [],
});

const mapDispatchToProps = {
  setFilter: filter => onListFlagsSet('subscriptionFilter', filter, viewConstants.CLUSTERS_VIEW),
};

export default connect(mapStateToProps, mapDispatchToProps)(ClusterListFilterDropdown);
