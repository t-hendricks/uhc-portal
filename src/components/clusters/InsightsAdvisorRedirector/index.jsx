import { connect } from 'react-redux';
import { fetchClusterDetails } from '../../../redux/actions/clustersActions';

import { setGlobalError } from '../../../redux/actions/globalErrorActions';

import InsightsAdvisorRedirector from './InsightsAdvisorRedirector';

const mapStateToProps = state => ({ clusterDetails: state.clusters.details });

const mapDispatchToProps = {
  fetchClusterDetails,
  setGlobalError,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(InsightsAdvisorRedirector);
