import { connect } from 'react-redux';

import InsightsRuleDetails from './InsightsRuleDetails';

import {
  fetchReportDetails,
  voteOnRuleInsights,
  disableRuleInsights,
  enableRuleInsights,
} from '../ClusterDetails/components/Insights/InsightsActions';

import { setGlobalError, clearGlobalError } from '../../../redux/actions/globalErrorActions';

import { fetchClusterDetails } from '../../../redux/actions/clustersActions';

import './index.scss';

const mapStateToProps = (state) => {
  const { details } = state.clusters;
  const { reportDetails } = state.insightsData;

  return ({
    clusterDetails: details,
    reportDetails,
  });
};

const mapDispatchToProps = {
  fetchClusterDetails: subscriptionID => fetchClusterDetails(subscriptionID),
  fetchReportData: (clusterUUID, ruleId, errorKey, isOSD) => (
    fetchReportDetails(clusterUUID, ruleId, errorKey, isOSD)
  ),
  disableRule: (clusterUUID, ruleId) => disableRuleInsights(clusterUUID, ruleId),
  enableRule: (clusterUUID, ruleId) => enableRuleInsights(clusterUUID, ruleId),
  clearGlobalError,
  setGlobalError,
  voteOnRule: (clusterUUID, ruleId, vote) => voteOnRuleInsights(clusterUUID, ruleId, vote),
};

export default connect(mapStateToProps, mapDispatchToProps)(InsightsRuleDetails);
