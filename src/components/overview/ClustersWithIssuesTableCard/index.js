import { connect } from 'react-redux';
import ClustersWithIssuesTableCard from './ClustersWithIssuesTableCard';
import { setClusterDetails, fetchClustersUsingParams } from '../../../redux/actions/clustersActions';
import { viewConstants } from '../../../redux/constants';

const mapDispatchToProps = {
  setClusterDetails,
  fetchClustersUsingParams,
};

const mapStateToProps = state => ({
  dashboardClusters: state.clusters.dashboardClusters,
  viewOptions: state.viewOptions[viewConstants.OVERVIEW_VIEW],
});

export default connect(mapStateToProps, mapDispatchToProps)(ClustersWithIssuesTableCard);
