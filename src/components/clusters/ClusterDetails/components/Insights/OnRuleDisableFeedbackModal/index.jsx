import { connect } from 'react-redux';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
import shouldShowModal from '../../../../../common/Modal/ModalSelectors';
import { closeModal } from '../../../../../common/Modal/ModalActions';
import { disableRuleInsights, sendFeedbackOnRuleDisableInsights } from '../InsightsActions';
import OnRuleDisableFeedbackModal from './OnRuleDisableFeedbackModal';

const mapStateToProps = (state) => {
  const { sendFeedbackOnRuleDisable: sendFeedbackOnRuleDisableResponse } = state.insightsData;
  const {
    clusterId, ruleId, errorKey, isManagedCluster, isRuleDetailsPage,
  } = state.modal.data;

  return {
    isOpen: shouldShowModal(state, 'insights-on-rule-disable-feedback-modal'),
    clusterId,
    ruleId,
    errorKey,
    isManagedCluster,
    isRuleDetailsPage,
    sendFeedbackOnRuleDisableResponse,
  };
};

const mapDispatchToProps = {
  sendFeedback: (clusterId, ruleId, errorKey, feedback) => (
    sendFeedbackOnRuleDisableInsights(clusterId, ruleId, errorKey, feedback)
  ),
  hideWindow: () => closeModal(),
  disableRule: disableRuleInsights,
  addNotification,
};

export default connect(mapStateToProps, mapDispatchToProps)(OnRuleDisableFeedbackModal);
