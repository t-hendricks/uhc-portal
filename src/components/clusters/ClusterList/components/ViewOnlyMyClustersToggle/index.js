import { connect } from 'react-redux';
import { viewOptionsConstants } from '../../../../../redux/constants';
import ViewOnlyMyClustersToggle from './ViewOnlyMyClustersToggle';

const mapStateToProps = (state, ownProps) => ({
  isChecked:
    state.viewOptions[ownProps.view].flags.showMyClustersOnly ??
    localStorage.getItem(ownProps.localStorageKey),
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
    localStorage.setItem(ownProps.localStorageKey, isChecked);
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewOnlyMyClustersToggle);
