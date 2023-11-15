import { connect } from 'react-redux';
import ClustersWithIssuesTableCard from './ClustersWithIssuesTableCard';
import { setClusterDetails } from '../../../redux/actions/clustersActions';
import { getUnhealthyClusters } from '../../../redux/actions/dashboardsActions';
import { viewConstants } from '../../../redux/constants';

const mapDispatchToProps = {
  setClusterDetails,
  getUnhealthyClusters,
};

const mapStateToProps = (state) => ({
  unhealthyClusters: state.dashboards.unhealthyClusters,
  viewOptions: state.viewOptions[viewConstants.OVERVIEW_VIEW],
});

export default connect(mapStateToProps, mapDispatchToProps)(ClustersWithIssuesTableCard);
