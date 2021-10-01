import React from 'react';
import {
  Button, Modal, Text, TextInput, TextVariants, Title,
} from '@patternfly/react-core';
import PropTypes from 'prop-types';

class OnRuleDisableFeedbackModal extends React.Component {
  state = { feedback: '', errorMessage: '' };

  componentDidUpdate(prevProps) {
    const { sendFeedbackOnRuleDisableResponse } = this.props;

    if (
      !prevProps.sendFeedbackOnRuleDisableResponse.fulfilled
      && sendFeedbackOnRuleDisableResponse.fulfilled
    ) {
      this.onClose();
    } else if (
      !prevProps.sendFeedbackOnRuleDisableResponse.rejected
      && sendFeedbackOnRuleDisableResponse.rejected
    ) {
      this.onError();
    }
  }

  onClose = () => {
    const { hideWindow } = this.props;
    this.setState({ feedback: '', errorMessage: '' });
    hideWindow();
  };

  onError = () => {
    this.setState({ errorMessage: 'There was an error during sending your feedback.' });
  };

  onSendFeedback = async () => {
    const {
      sendFeedback,
      clusterId,
      ruleId,
      errorKey,
      isRuleDetailsPage,
      isManagedCluster,
      disableRule,
    } = this.props;

    const { feedback } = this.state;

    await sendFeedback(clusterId, ruleId, errorKey, feedback);
    await disableRule(clusterId, ruleId, errorKey, isRuleDetailsPage, isManagedCluster);

    return true;
  };

  render() {
    const {
      isOpen,
    } = this.props;

    const { feedback, errorMessage } = this.state;

    return (
      <Modal
        className="insights-on-rule-disabled-feedback-modal"
        variant="small"
        title="Disable recommendation"
        isOpen={isOpen}
        onClose={this.onClose}
        ouiaId="ruleDisableModal"
        actions={[
          <Button
            key="confirm"
            variant="primary"
            onClick={this.onSendFeedback}
          >
            Save
          </Button>,
          <Button key="cancel" variant="link" onClick={this.onClose}>
            Cancel
          </Button>,
        ]}
        onEscapePress={this.onClose}
      >
        <div>
          If you disable this recommendation, OpenShift Cluster Manager will no longer show
          this recommendation in dashboard, reports, and tables for this cluster.
        </div>
        <div>
          <Title className="insights-justification-note" headingLevel="h6" size="md">
            Justification note
          </Title>
          <TextInput
            value={feedback}
            onChange={(value) => {
              this.setState({ feedback: value });
            }}
            validated={errorMessage.length > 0 ? 'error' : 'default'}
          />
        </div>
        <div className="error-message">
          {
            errorMessage.length
              ? <Text component={TextVariants.h5}>{errorMessage}</Text>
              : null
          }
        </div>
      </Modal>
    );
  }
}

OnRuleDisableFeedbackModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  hideWindow: PropTypes.func.isRequired,
  sendFeedback: PropTypes.func.isRequired,
  sendFeedbackOnRuleDisableResponse: PropTypes.object,
  clusterId: PropTypes.string.isRequired,
  ruleId: PropTypes.string.isRequired,
  errorKey: PropTypes.string.isRequired,
  disableRule: PropTypes.func.isRequired,
  isRuleDetailsPage: PropTypes.bool.isRequired,
  isManagedCluster: PropTypes.bool.isRequired,
};

export default OnRuleDisableFeedbackModal;
