
import { connect } from 'react-redux';
import { viewConstants } from '../../../../../redux/constants';
import ClusterListExtraActions from './ClusterListExtraActions';
import { clustersActions } from '../../../../../redux/actions';

const mapStateToProps = state => ({
  currentFlags: state.viewOptions[viewConstants.CLUSTERS_VIEW].flags,
});

const mapDispatchToProps = {
  invalidateClusters: () => clustersActions.invalidateClusters(),
};

export default connect(mapStateToProps, mapDispatchToProps)(ClusterListExtraActions);
