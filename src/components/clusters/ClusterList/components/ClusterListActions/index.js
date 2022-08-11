import { connect } from 'react-redux';
import { featureConstants, viewConstants, viewOptionsConstants } from '../../../../../redux/constants';
import ClusterListExtraActions from './ClusterListActions';

const mapStateToProps = state => ({
  aiEnabled: state.features[featureConstants.ASSISTED_INSTALLER_FEATURE],
  showMyClustersOnly: state.viewOptions[viewConstants.CLUSTERS_VIEW].flags.showMyClustersOnly,
});

const mapDispatchToProps = dispatch => ({
  onShowMyClustersOnlyChange: (isChecked) => {
    dispatch({
      type: viewOptionsConstants.VIEW_MY_CLUSTERS_ONLY_CHANGED,
      payload: {
        showMyClustersOnly: isChecked,
      },
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ClusterListExtraActions);
