import { connect } from 'react-redux';
import { onListFilterSet } from '../../../../redux/actions/viewOptionsActions';
import ClusterListFilter from './ClusterListFilter';

const mapStateToProps = (state, ownProps) => ({
  currentFilter: state.viewOptions[ownProps.view].filter,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  setFilter: (filter) => dispatch(onListFilterSet(filter, ownProps.view)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ClusterListFilter);
