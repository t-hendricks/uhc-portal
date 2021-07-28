import { connect } from 'react-redux';

import InsightsRuleDetails from './InsightsRuleDetails';
import { modalActions } from '../../common/Modal/ModalActions';

import {
  fetchReportDetails,
  voteOnRuleInsights,
  enableRuleInsights,
} from '../ClusterDetails/components/Insights/InsightsActions';

import { setGlobalError, clearGlobalError } from '../../../redux/actions/globalErrorActions';

import { fetchClusterDetails } from '../../../redux/actions/clustersActions';

import './index.scss';

const mapStateToProps = (state) => {
  const { details } = state.clusters;
  const { reportDetails } = state.insightsData;
  const { sendFeedbackOnRuleDisable: sendFeedbackOnRuleRefresh } = state.insightsData;

  return ({
    clusterDetails: details,
    reportDetails,
    sendFeedbackOnRuleRefresh,
  });
};

const mapDispatchToProps = {
  fetchClusterDetails: subscriptionID => fetchClusterDetails(subscriptionID),
  fetchReportData: (clusterUUID, ruleId, errorKey, isOSD) => (
    fetchReportDetails(clusterUUID, ruleId, errorKey, isOSD)
  ),
  openModal: modalActions.openModal,
  enableRule: (clusterId, ruleId, errorKey) => enableRuleInsights(clusterId, ruleId, errorKey),
  clearGlobalError,
  setGlobalError,
  voteOnRule: (clusterUUID, ruleId, errorKey, vote) => voteOnRuleInsights(
    clusterUUID, ruleId, errorKey, vote,
  ),
};

export default connect(mapStateToProps, mapDispatchToProps)(InsightsRuleDetails);
