import { connect } from 'react-redux';
import shouldShowModal from '../../../../../common/Modal/ModalSelectors';
import { closeModal } from '../../../../../common/Modal/ModalActions';
import { sendFeedbackOnRuleDisableInsights } from '../InsightsActions';
import OnRuleDisableFeedbackModal from './OnRuleDisableFeedbackModal';

const mapStateToProps = (state) => {
  const { sendFeedbackOnRuleDisable: sendFeedbackOnRuleDisableResponse } = state.insightsData;
  const { clusterId, ruleId } = state.modal.data;

  return {
    isOpen: shouldShowModal(state, 'insights-on-rule-disable-feedback-modal'),
    clusterId,
    ruleId,
    sendFeedbackOnRuleDisableResponse,
  };
};

const mapDispatchToProps = {
  sendFeedback: (clusterId, ruleId, feedback) => (
    sendFeedbackOnRuleDisableInsights(clusterId, ruleId, feedback)
  ),
  hideWindow: () => closeModal(),
};

export default connect(mapStateToProps, mapDispatchToProps)(OnRuleDisableFeedbackModal);
