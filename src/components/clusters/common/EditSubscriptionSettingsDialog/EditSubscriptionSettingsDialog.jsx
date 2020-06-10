import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get, findIndex } from 'lodash';
import {
  Form, TextContent, Text, TextVariants,
} from '@patternfly/react-core';

import Modal from '../../../common/Modal/Modal';
import { ReduxFormRadioGroup } from '../../../common/ReduxFormComponents';
import {
  subscriptionSettings,
  subscriptionSupportLevels,
  subscriptionServiceLevels,
  subscriptionUsages,
  subscriptionProductBundles,
  subscriptionSystemUnits,
} from '../../../../common/subscriptionTypes';
import EditSubscriptionSettingsRequestState from './EditSubscriptionSettingsRequestState';

const {
  SUPPORT_LEVEL,
  USAGE,
  SERVICE_LEVEL,
  PRODUCT_BUNDLE,
  SYSTEM_UNITS,
} = subscriptionSettings;

const {
  EVAL,
  PREMIUM,
  STANDARD,
  SELF_SUPPORT,
  NONE,
} = subscriptionSupportLevels;

const {
  L1_L3,
  L3_ONLY,
} = subscriptionServiceLevels;

const {
  PRODUCTION,
  DEV_TEST,
  DISASTER_RECOVERY,
} = subscriptionUsages;

const {
  OPENSHIFT,
  JBOSS_MIDDLEWARE,
  IBM_CLOUDPAK,
} = subscriptionProductBundles;

const {
  CORES_VCPU,
  SOCKETS,
} = subscriptionSystemUnits;


class EditSubscriptionSettingsDialog extends Component {
  state = {}

  options = {
    [SUPPORT_LEVEL]: [],
    [SERVICE_LEVEL]: [],
    [USAGE]: [],
    [SYSTEM_UNITS]: [],
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { subscription } = nextProps;
    const nextState = this.resetOptions(subscription);
    this.setState(nextState);
  }

  resetOptions = (subscription) => {
    const nextState = {};

    [
      SUPPORT_LEVEL,
      USAGE,
      SERVICE_LEVEL,
      SYSTEM_UNITS,
    ].forEach(
      (setting) => {
        const options = this.getOptions(subscription, setting);
        this.options[setting] = options;
        const idx = findIndex(options, 'isChecked');
        if (idx >= 0) {
          nextState[setting] = options[idx].value;
        }
      },
    );

    return nextState;
  }

  getOptions = (subscription, setting) => {
    const value = get(subscription, setting);
    let options = [];
    switch (setting) {
      case SUPPORT_LEVEL:
        options = [
          { label: 'Premium', value: PREMIUM },
          { label: 'Standard', value: STANDARD },
          { label: 'Self-support', value: SELF_SUPPORT },
        ];
        if (value === EVAL) {
          options.push({
            label: 'Self-support 60-day evaluation',
            value: EVAL,
          });
        } else if (value === NONE) {
          options.push({
            label: <span className="subscription-settings expired-eval-option">Expired evaluation</span>,
            value: NONE,
          });
        }
        break;
      case USAGE:
        options = [
          { label: 'Production', value: PRODUCTION, isDefault: true },
          { label: 'Dev/test', value: DEV_TEST },
          { label: 'Disaster recovery', value: DISASTER_RECOVERY },
        ];
        break;
      case SERVICE_LEVEL:
        options = [
          { label: 'L1-L3', value: L1_L3, isDefault: true },
          { label: 'L3 only', value: L3_ONLY },
        ];
        break;
      case PRODUCT_BUNDLE:
        options = [
          { label: 'OpenShift', value: OPENSHIFT, isDefault: true },
          { label: 'JBoss Middleware', value: JBOSS_MIDDLEWARE },
          { label: 'IBM CloudPak', value: IBM_CLOUDPAK },
        ];
        break;
      case SYSTEM_UNITS:
        options = [
          { label: 'Cores/vCPU', value: CORES_VCPU, isDefault: true },
          { label: 'Sockets', value: SOCKETS },
        ];
        break;
      default:
    }

    const i = findIndex(options, { value });
    if (i >= 0) {
      options[i].isChecked = true;
    } else {
      // fallback to default
      const j = findIndex(options, 'isDefault');
      if (j >= 0) {
        options[j].isChecked = true;
      }
    }
    return options;
  }

  handleChange = (name, value) => {
    this.setState({ [name]: value });
  };

  handleSubmit = () => {
    const { submit, subscription } = this.props;
    submit(subscription.id, this.state);
  };

  handleClose = () => {
    const { closeModal } = this.props;
    closeModal();
  }

  render() {
    const { isOpen, requestState, onClose } = this.props;
    const radioGroupClassName = 'subscription-settings radio-group';
    const { [SUPPORT_LEVEL]: supportLevel } = this.state;
    const isDisabled = supportLevel !== PREMIUM
      && supportLevel !== STANDARD
      && supportLevel !== SELF_SUPPORT;

    return isOpen && (
      <Modal
        title="Subscription settings"
        width={810}
        isLarge
        onClose={this.handleClose}
        primaryText="Save settings"
        secondaryText="Cancel"
        onPrimaryClick={this.handleSubmit}
        onSecondaryClick={this.handleClose}
        isPrimaryDisabled={requestState.pending || isDisabled}
      >
        <EditSubscriptionSettingsRequestState
          requestState={requestState}
          onFulfilled={() => { this.handleClose(); onClose(); }}
        />
        <TextContent>
          <Text component={TextVariants.p}>
          Editing the subscription settings will help ensure that
          you receive the level of support that you expect, and that
          your cluster is consuming the correct type of subscription.
          </Text>
        </TextContent>
        <Form onSubmit={(e) => { this.handleSubmit(); e.preventDefault(); }} className="subscription-settings form">
          <ReduxFormRadioGroup
            name={SUPPORT_LEVEL}
            fieldId={SUPPORT_LEVEL}
            label="Choose the support type for this cluster."
            className={radioGroupClassName}
            items={this.options[SUPPORT_LEVEL]}
            onChange={this.handleChange}
          />
          <ReduxFormRadioGroup
            name={USAGE}
            fieldId={USAGE}
            label="How do you intend to use this cluster?"
            className={radioGroupClassName}
            items={this.options[USAGE]}
            onChange={this.handleChange}
            isDisabled={isDisabled}
          />
          <ReduxFormRadioGroup
            name={SERVICE_LEVEL}
            fieldId={SERVICE_LEVEL}
            label="Choose your service level. (If you bought your subscription through Red Hat, choose L1-L3.)"
            className={radioGroupClassName}
            items={this.options[SERVICE_LEVEL]}
            onChange={this.handleChange}
            isDisabled={isDisabled}
          />
          {false && ( // TODO: either add back or remove PRODUCT_BUNDLE
            <ReduxFormRadioGroup
              name={PRODUCT_BUNDLE}
              fieldId={PRODUCT_BUNDLE}
              label="Do you intend to use an OpenShift subscription, or is this cluster associated with JBoss Middleware or an IBM CloudPak?"
              className={radioGroupClassName}
              items={this.options[PRODUCT_BUNDLE]}
              onChange={this.handleChange}
              isDisabled={isDisabled}
            />
          )}
          <ReduxFormRadioGroup
            name={SYSTEM_UNITS}
            fieldId={SYSTEM_UNITS}
            label="What unit of measure do you want to use, cores/vCPU or sockets?"
            className={radioGroupClassName}
            items={this.options[SYSTEM_UNITS]}
            onChange={this.handleChange}
            isDisabled={isDisabled}
          />
        </Form>
      </Modal>
    );
  }
}

EditSubscriptionSettingsDialog.propTypes = {
  subscription: PropTypes.object,
  requestState: PropTypes.object,
  isOpen: PropTypes.bool,
  closeModal: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

EditSubscriptionSettingsDialog.defaultProps = {
  isOpen: false,
};

export default EditSubscriptionSettingsDialog;
