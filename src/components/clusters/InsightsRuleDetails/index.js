import { connect } from 'react-redux';

import InsightsRuleDetails from './InsightsRuleDetails';

import {
  fetchReportDetails,
  voteOnRuleInsights,
  disableRuleInsights,
  enableRuleInsights,
} from '../ClusterDetails/components/Insights/InsightsActions';

import { setGlobalError, clearGlobalError } from '../../../redux/actions/globalErrorActions';

import {
  fetchClusterDetails,
  invalidateClusters,
} from '../../../redux/actions/clustersActions';

import canAllowAdminSelector from '../common/ToggleClusterAdminAccessDialog/ClusterAdminSelectors';
import './index.scss';

const mapStateToProps = (state) => {
  const { details } = state.clusters;
  const { reportDetails } = state.insightsData;

  return ({
    clusterDetails: details,
    reportDetails,
    anyModalOpen: !!state.modal.modalName,
    canAllowClusterAdmin: canAllowAdminSelector(state),
  });
};

const mapDispatchToProps = {
  fetchClusterDetails: clusterId => fetchClusterDetails(clusterId),
  fetchReportData: (clusterId, ruleId) => fetchReportDetails(clusterId, ruleId),
  disableRule: (clusterId, ruleId) => disableRuleInsights(clusterId, ruleId),
  enableRule: (clusterId, ruleId) => enableRuleInsights(clusterId, ruleId),
  invalidateClusters,
  clearGlobalError,
  setGlobalError,
  voteOnRule: (clusterId, ruleId, vote) => voteOnRuleInsights(clusterId, ruleId, vote),
};

export default connect(mapStateToProps, mapDispatchToProps)(InsightsRuleDetails);
