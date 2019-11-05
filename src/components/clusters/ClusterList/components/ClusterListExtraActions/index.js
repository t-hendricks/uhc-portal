
import { connect } from 'react-redux';
import { viewConstants } from '../../../../../redux/constants';
import ClusterListExtraActions from './ClusterListExtraActions';

const mapStateToProps = state => ({
  currentFlags: state.viewOptions[viewConstants.CLUSTERS_VIEW].flags,
});

export default connect(mapStateToProps)(ClusterListExtraActions);
