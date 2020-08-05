
import { connect } from 'react-redux';
import { viewConstants, featureConstants } from '../../../../../redux/constants';
import ClusterListExtraActions from './ClusterListExtraActions';

const mapStateToProps = state => ({
  currentFlags: state.viewOptions[viewConstants.CLUSTERS_VIEW].flags,
  aiEnabled: state.features[featureConstants.ASSISTED_INSTALLER_FEATURE],
});

export default connect(mapStateToProps)(ClusterListExtraActions);
