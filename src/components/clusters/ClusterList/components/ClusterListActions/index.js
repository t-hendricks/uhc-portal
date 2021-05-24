import { connect } from 'react-redux';
import { featureConstants } from '../../../../../redux/constants';
import ClusterListExtraActions from './ClusterListActions';

const mapStateToProps = state => ({
  aiEnabled: state.features[featureConstants.ASSISTED_INSTALLER_FEATURE],
});

export default connect(mapStateToProps)(ClusterListExtraActions);
