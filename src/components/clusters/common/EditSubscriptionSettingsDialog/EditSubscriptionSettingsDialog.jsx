import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Form, TextContent, Text, TextVariants,
} from '@patternfly/react-core';

import Modal from '../../../common/Modal/Modal';
import modals from '../../../common/Modal/modals';
import EditSubscriptionSettingsRequestState from './EditSubscriptionSettingsRequestState';
import EditSubscriptionSettingsFields from './EditSubscriptionSettingsFields';
import { hasCapability, subscriptionCapabilities } from '../../../../common/subscriptionCapabilities';

const { SUBSCRIBED_OCP, SUBSCRIBED_OCP_MARKETPLACE } = subscriptionCapabilities;

class EditSubscriptionSettingsDialog extends Component {
  state = { isValid: true }

  handleSubmit = () => {
    const { submit, subscription } = this.props;
    submit(subscription.id, this.state);
  };

  handleClose = () => {
    const { closeModal } = this.props;
    closeModal();
  }

  handleSettingsChange = (newSettings) => {
    this.setState(newSettings);
  }

  render() {
    const {
      requestState,
      onClose,
      subscription,
      clusterDisplayName,
      shouldDisplayClusterName,
    } = this.props;

    const {
      isValid,
    } = this.state;

    return (
      <Modal
        title="Subscription settings"
        secondaryTitle={shouldDisplayClusterName ? clusterDisplayName : undefined}
        width={810}
        variant="large"
        onClose={this.handleClose}
        primaryText="Save"
        secondaryText="Cancel"
        onPrimaryClick={this.handleSubmit}
        onSecondaryClick={this.handleClose}
        isPrimaryDisabled={requestState.pending || !isValid}
      >
        <EditSubscriptionSettingsRequestState
          requestState={requestState}
          onFulfilled={() => { this.handleClose(); onClose(); }}
        />
        <Form onSubmit={(e) => { this.handleSubmit(); e.preventDefault(); }} className="subscription-settings form">
          <TextContent>
            <Text component={TextVariants.p}>
              Edit your subscription settings to receive the correct level of cluster support.
            </Text>
          </TextContent>
          <EditSubscriptionSettingsFields
            initialSettings={subscription}
            onSettingsChange={this.handleSettingsChange}
            canSubscribeStandardOCP={hasCapability(subscription, SUBSCRIBED_OCP)}
            canSubscribeMarketplaceOCP={hasCapability(subscription, SUBSCRIBED_OCP_MARKETPLACE)}
          />
        </Form>
      </Modal>
    );
  }
}

EditSubscriptionSettingsDialog.propTypes = {
  subscription: PropTypes.object,
  requestState: PropTypes.object,
  closeModal: PropTypes.func,
  submit: PropTypes.func,
  onClose: PropTypes.func,
  clusterDisplayName: PropTypes.string,
  shouldDisplayClusterName: PropTypes.bool,
};

EditSubscriptionSettingsDialog.defaultProps = {
  subscription: {},
};
EditSubscriptionSettingsDialog.modalName = modals.EDIT_SUBSCRIPTION_SETTINGS;

export default EditSubscriptionSettingsDialog;
