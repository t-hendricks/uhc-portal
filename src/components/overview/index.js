import { connect } from 'react-redux';
import Overview from './Overview';
import { clustersActions } from '../../redux/actions/clustersActions';
import { viewConstants } from '../../redux/constants';
import { getSummaryDashboard } from '../../redux/actions/dashboardsActions';

const mapDispatchToProps = {
  getSummaryDashboard,
  setClusterDetails: clustersActions.setClusterDetails,
  fetchClustersUsingParams: clustersActions.fetchClustersUsingParams,
};

function mapStateToProps(state) {
  return {
    dashboardClusters: state.clusters.dashboardClusters,
    dashboards: state.dashboards,
    viewOptions: state.viewOptions[viewConstants.OVERVIEW_VIEW],
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Overview);
