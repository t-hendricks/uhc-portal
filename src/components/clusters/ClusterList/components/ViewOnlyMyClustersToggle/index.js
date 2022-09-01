import { connect } from 'react-redux';
import { viewOptionsConstants } from '../../../../../redux/constants';
import ViewOnlyMyClustersToggle from './ViewOnlyMyClustersToggle';

const mapStateToProps = (state, ownProps) => ({
  isChecked: state.viewOptions[ownProps.view].flags.showMyClustersOnly,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onChange: (isChecked) => {
    dispatch({
      viewType: ownProps.view,
      type: viewOptionsConstants.VIEW_MY_CLUSTERS_ONLY_CHANGED,
      payload: {
        showMyClustersOnly: isChecked,
      },
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewOnlyMyClustersToggle);
