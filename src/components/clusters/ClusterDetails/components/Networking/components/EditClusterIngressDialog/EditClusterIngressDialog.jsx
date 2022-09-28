import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import {
  Form,
  FormGroup,
  TextInput,
  Alert,
  AlertVariant,
  ClipboardCopy,
  ExpandableSection,
} from '@patternfly/react-core';

import Modal from '../../../../../../common/Modal/Modal';
import ErrorBox from '../../../../../../common/ErrorBox';
import {
  ReduxCheckbox,
  ReduxVerticalFormGroup,
} from '../../../../../../common/ReduxFormComponents';
import ExternalLink from '../../../../../../common/ExternalLink';

import links from '../../../../../../../common/installLinks.mjs';
import { checkRouteSelectors } from '../../../../../../../common/validators';

class EditClusterIngressDialog extends React.Component {
  componentDidUpdate(prevProps) {
    const { editClusterRoutersResponse, refreshCluster } = this.props;
    if (prevProps.editClusterRoutersResponse.pending && editClusterRoutersResponse.fulfilled) {
      refreshCluster();
      this.onClose();
    }
  }

  onClose = () => {
    const { closeModal, reset, resetResponse } = this.props;
    reset();
    resetResponse();
    closeModal();
  };

  render() {
    const {
      provider,
      controlPlaneAPIEndpoint,
      defaultRouterAddress,
      additionalRouterAddress,
      editClusterRoutersResponse,
      isOpen,
      hideAdvancedOptions,
      additionalRouterEnabled,
      showRouterVisibilityWarning,
      valid,
      pristine,
      handleSubmit,
    } = this.props;

    const editRoutersError = editClusterRoutersResponse.error ? (
      <ErrorBox message="Error editing cluster ingress" response={editClusterRoutersResponse} />
    ) : null;

    const privacySettingsWarningBox = (
      <Alert
        id="privacySettingsWarningBox"
        title="Editing the privacy settings may require additional actions in your cloud provider account to maintain access."
        variant={AlertVariant.warning}
        isPlain
        isInline
      >
        {provider === 'aws' ? (
          <ExternalLink href={links.OSD_PRIVATE_CLUSTER}>
            Learn more about cluster privacy
          </ExternalLink>
        ) : null}
      </Alert>
    );

    const routerVisibilityWarningBox = showRouterVisibilityWarning ? (
      <Alert
        id="routerVisibilityWarningBox"
        title="All routers will be exposed publicly because there is no label match on the additional application router. This is a potential security risk."
        variant={AlertVariant.warning}
        isPlain
        isInline
      />
    ) : null;

    const advancedOptions = hideAdvancedOptions ? null : (
      <ExpandableSection toggleText="Advanced options">
        <Form>
          <FormGroup fieldId="enable_additional_router" isStack>
            <Field
              component={ReduxCheckbox}
              name="enable_additional_router"
              label="Enable additional router"
            />
          </FormGroup>
          <FormGroup fieldId="additional_router_address" isStack>
            <TextInput
              id="additional_router_address"
              value={`*.${additionalRouterAddress}`}
              isReadOnly
            />
            <Field
              component={ReduxCheckbox}
              name="private_additional_router"
              label="Make router private"
              isDisabled={!additionalRouterEnabled}
            />
          </FormGroup>
          <Field
            component={ReduxVerticalFormGroup}
            aria-label="Additional Router Labels"
            name="labels_additional_router"
            label="Label match for additional router (optional)"
            type="text"
            helpText="Comma separated pairs in key=value format. If no label is specified, all routes will be exposed on both routers."
            validate={checkRouteSelectors}
            key="route_selectors"
            isDisabled={!additionalRouterEnabled}
          />
        </Form>
      </ExpandableSection>
    );

    return (
      isOpen && (
        <Modal
          width="max(35%, 550px)"
          primaryText="Save"
          secondaryText="Cancel"
          title="Edit cluster ingress"
          onClose={this.onClose}
          onPrimaryClick={handleSubmit}
          onSecondaryClick={this.onClose}
          isPending={editClusterRoutersResponse.pending}
          isPrimaryDisabled={!valid || pristine}
        >
          {editRoutersError}
          <Form>
            {privacySettingsWarningBox}
            {routerVisibilityWarningBox}
            <FormGroup
              fieldId="control_plane_api_endpoint"
              label="Control Plane API endpoint"
              isStack
            >
              <ClipboardCopy name="control_plane_api_endpoint" isReadOnly>
                {controlPlaneAPIEndpoint}
              </ClipboardCopy>
              <Field component={ReduxCheckbox} name="private_api" label="Make API private" />
            </FormGroup>
            <FormGroup fieldId="default_router_address" label="Default application router" isStack>
              <TextInput
                id="default_router_address"
                value={`*.${defaultRouterAddress}`}
                isReadOnly
              />
              <Field
                component={ReduxCheckbox}
                name="private_default_router"
                label="Make router private"
              />
            </FormGroup>
            {advancedOptions}
          </Form>
        </Modal>
      )
    );
  }
}

EditClusterIngressDialog.propTypes = {
  provider: PropTypes.string,
  controlPlaneAPIEndpoint: PropTypes.string.isRequired,
  defaultRouterAddress: PropTypes.string.isRequired,
  additionalRouterAddress: PropTypes.string.isRequired,
  initialValues: PropTypes.shape({
    private_api: PropTypes.bool,
    private_default_router: PropTypes.bool,
    enable_additional_router: PropTypes.bool,
    private_additional_router: PropTypes.bool,
    labels_additional_router: PropTypes.string,
  }).isRequired,
  editClusterRoutersResponse: PropTypes.shape({
    error: PropTypes.bool,
    fulfilled: PropTypes.bool,
    pending: PropTypes.bool,
  }).isRequired,
  reset: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  resetResponse: PropTypes.func.isRequired,
  refreshCluster: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  valid: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  hideAdvancedOptions: PropTypes.bool.isRequired,
  additionalRouterEnabled: PropTypes.bool.isRequired,
  showRouterVisibilityWarning: PropTypes.bool.isRequired,
};

export default EditClusterIngressDialog;
