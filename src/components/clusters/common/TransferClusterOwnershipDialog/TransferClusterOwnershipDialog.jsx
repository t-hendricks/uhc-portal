import get from 'lodash/get';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  TextContent, Text, TextVariants,
  TextList, TextListVariants, TextListItem,
} from '@patternfly/react-core';

import Modal from '../../../common/Modal/Modal';
import ErrorBox from '../../../common/ErrorBox';


class TransferClusterOwnershipDialog extends Component {
  componentDidUpdate() {
    const { requestState, onClose } = this.props;
    if (requestState.fulfilled) {
      this.handleClose();
      onClose();
    }
  }

  handleSubmit = () => {
    const { submit, subscription } = this.props;
    const isReleased = get(subscription, 'released', false);
    submit(subscription.id, !isReleased);
  };

  handleClose = () => {
    const { closeModal } = this.props;
    closeModal();
  }

  render() {
    const {
      isOpen,
      requestState,
    } = this.props;

    const changePullSecretUrl = 'https://access.redhat.com/solutions/4902871';

    return isOpen && (
      <Modal
        title="Transfer cluster ownership"
        width={600}
        variant="large"
        onClose={this.handleClose}
        primaryText="Initiate transfer"
        secondaryText="Cancel"
        onPrimaryClick={this.handleSubmit}
        onSecondaryClick={this.handleClose}
        isPrimaryDisabled={requestState.pending}
      >
        { requestState.error && (
          <ErrorBox message="Error initiating transfer" response={requestState} />
        )}
        <TextContent>
          <Text component={TextVariants.p}>
            Transferring cluster ownership will allow another individual to manage this cluster.
            The steps for transferring cluster ownership are:
          </Text>
          <TextList component={TextListVariants.ol}>
            <TextListItem>Initiate transfer</TextListItem>
            <TextListItem>
              <a href={changePullSecretUrl} target="_blank" rel="noreferrer noopener">
                Change the cluster&apos;s pull secret
              </a>
              {' '}
              within 5 days
            </TextListItem>
          </TextList>
          <Text component={TextVariants.p}>
            The transfer is complete when OpenShift Cluster Manager receives
            telemetry data from the cluster with the new pull secret.
          </Text>
          <Text component={TextVariants.h4}>
            If the transfer is not completed within 5 days, the procedure must be restarted.
          </Text>
        </TextContent>
      </Modal>
    );
  }
}

TransferClusterOwnershipDialog.propTypes = {
  subscription: PropTypes.object,
  requestState: PropTypes.object,
  isOpen: PropTypes.bool,
  closeModal: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

TransferClusterOwnershipDialog.defaultProps = {
  isOpen: false,
};

export default TransferClusterOwnershipDialog;
