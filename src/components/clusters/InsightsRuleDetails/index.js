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
  fetchClusterDetails,
  fetchReportData: fetchReportDetails,
  openModal: modalActions.openModal,
  enableRule: enableRuleInsights,
  clearGlobalError,
  setGlobalError,
  voteOnRule: voteOnRuleInsights,
};

export default connect(mapStateToProps, mapDispatchToProps)(InsightsRuleDetails);
