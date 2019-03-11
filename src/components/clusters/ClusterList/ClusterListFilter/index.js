
import { connect } from 'react-redux';
import { onListFilterSet } from '../../../../redux/actions/viewOptionsActions';
import { viewConstants } from '../../../../redux/constants';
import ClusterListFilter from './ClusterListFilter';

const mapStateToProps = state => ({
  currentFilter: state.viewOptions[viewConstants.CLUSTERS_VIEW].filter,
});

const mapDispatchToProps = {
  setFilter: filter => onListFilterSet(filter, viewConstants.CLUSTERS_VIEW),
};

export default connect(mapStateToProps, mapDispatchToProps)(ClusterListFilter);
