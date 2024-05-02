import { connect } from 'react-redux';

import { setClusterDetails } from '../../../redux/actions/clustersActions';
import { getUnhealthyClusters } from '../../../redux/actions/dashboardsActions';
import { viewConstants } from '../../../redux/constants';

import ClustersWithIssuesTableCard from './ClustersWithIssuesTableCard';

const mapDispatchToProps = {
  setClusterDetails,
  getUnhealthyClusters,
};

const mapStateToProps = (state) => ({
  unhealthyClusters: state.dashboards.unhealthyClusters,
  viewOptions: state.viewOptions[viewConstants.OVERVIEW_VIEW],
});

export default connect(mapStateToProps, mapDispatchToProps)(ClustersWithIssuesTableCard);
