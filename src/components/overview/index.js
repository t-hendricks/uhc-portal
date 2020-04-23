import { connect } from 'react-redux';
import Overview from './Overview';
import { setClusterDetails, fetchClustersUsingParams } from '../../redux/actions/clustersActions';
import { viewConstants } from '../../redux/constants';
import { getSummaryDashboard } from '../../redux/actions/dashboardsActions';

const mapDispatchToProps = {
  getSummaryDashboard,
  setClusterDetails,
  fetchClustersUsingParams,
};

const mapStateToProps = state => ({
  dashboardClusters: state.clusters.dashboardClusters,
  dashboards: state.dashboards,
  viewOptions: state.viewOptions[viewConstants.OVERVIEW_VIEW],
});

export default connect(mapStateToProps, mapDispatchToProps)(Overview);
