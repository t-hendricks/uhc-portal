import { connect } from 'react-redux';
import { onListFlagsSet } from '../../../../../redux/actions/viewOptionsActions';
import ClusterListFilterDropdown from './ClusterListFilterDropdown';

const mapStateToProps = (state, ownProps) => ({
  currentFilters: state.viewOptions[ownProps.view].flags.subscriptionFilter || {},
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  setFilter: (filter) => dispatch(onListFlagsSet('subscriptionFilter', filter, ownProps.view)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ClusterListFilterDropdown);
