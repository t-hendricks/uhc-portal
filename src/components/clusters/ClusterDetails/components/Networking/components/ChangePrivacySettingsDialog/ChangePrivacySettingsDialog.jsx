import React from 'react';
import PropTypes from 'prop-types';
import {
  Form, Alert, Stack, StackItem,
} from '@patternfly/react-core';

import links from '../../../../../../../common/installLinks.mjs';
import Modal from '../../../../../../common/Modal/Modal';
import ErrorBox from '../../../../../../common/ErrorBox';

class ChangePrivacySettingsDialog extends React.Component {
  componentDidUpdate(prevProps) {
    const { editClusterRoutersResponse, refreshCluster } = this.props;
    if (prevProps.editClusterRoutersResponse.pending
      && editClusterRoutersResponse.fulfilled) {
      refreshCluster();
      this.onClose();
    }
  }

  onClose = () => {
    const { closeModal, resetResponse } = this.props;
    resetResponse();
    closeModal();
  }

  render() {
    const {
      isOpen,
      shouldShowAlert,
      onConfirm,
      editClusterRoutersResponse,
      provider,
    } = this.props;
    let cloudProvider;
    if (provider === 'gcp') {
      cloudProvider = 'GCP';
    } else if (provider === 'aws') {
      cloudProvider = 'AWS';
    } else {
      cloudProvider = 'cloud provider';
    }
    const text = `Changing the cluster's privacy settings may cause you to lose access to the cluster. Changes may be required in ${cloudProvider} to maintain access. 
                  It may take up to one hour for the settings to become effective.`;
    const learnMore = (
      <a href={links.OSD_PRIVATE_CLUSTER} target="_blank" rel="noopener noreferrer">
        Learn more
      </a>
    );
    const noRouteSelectorsWarning = 'All routers will be exposed publicly because there is no label match on the additional application router. This is a potential security risk.';
    const editRoutersError = editClusterRoutersResponse.error ? (
      <ErrorBox message="Error editing cluster routers" response={editClusterRoutersResponse} />
    ) : null;

    return isOpen && (
      <Modal
        onClose={this.onClose}
        primaryText="Change settings"
        secondaryText="Cancel"
        title="Change cluster privacy settings?"
        width="35%"
        isSmall={false}
        onPrimaryClick={() => onConfirm()}
        onSecondaryClick={this.onClose}
        isPending={editClusterRoutersResponse.pending}
      >
        {editRoutersError}
        <Form>
          <Stack hasGutter>
            <StackItem>
              {text}
              {' '}
              {provider === 'aws' && learnMore}
            </StackItem>
            {
              shouldShowAlert && (
                <StackItem>
                  <Alert
                    id="noRouteSelectors"
                    variant="warning"
                    isInline
                    title={noRouteSelectorsWarning}
                  />
                </StackItem>
              )
            }
          </Stack>
        </Form>
      </Modal>
    );
  }
}

ChangePrivacySettingsDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  shouldShowAlert: PropTypes.bool,
  resetResponse: PropTypes.func.isRequired,
  editClusterRoutersResponse: PropTypes.shape({
    error: PropTypes.bool,
    fulfilled: PropTypes.bool,
    pending: PropTypes.bool,
  }).isRequired,
  refreshCluster: PropTypes.func.isRequired,
  provider: PropTypes.string,
};

export default ChangePrivacySettingsDialog;
