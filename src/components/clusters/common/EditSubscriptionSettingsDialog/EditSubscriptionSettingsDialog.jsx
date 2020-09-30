import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get, findIndex } from 'lodash';
import { Field } from 'redux-form';
import {
  Form, TextContent, Text, TextVariants, FormGroup, Tooltip, TooltipPosition,
} from '@patternfly/react-core';

import Modal from '../../../common/Modal/Modal';
import { ReduxFormRadioGroup } from '../../../common/ReduxFormComponents';
import RadioButtons from '../../../common/ReduxFormComponents/RadioButtons';
import {
  subscriptionSettings,
  subscriptionSupportLevels,
  subscriptionServiceLevels,
  subscriptionUsages,
  subscriptionProductBundles,
  subscriptionSystemUnits,
} from '../../../../common/subscriptionTypes';
import EditSubscriptionSettingsRequestState from './EditSubscriptionSettingsRequestState';
import UnitFields from './UnitsFields';

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
  state = { isValid: true }

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
        if (value === EVAL || !subscription.id) {
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

  handleChange = (name, value, isValid = true) => {
    this.setState({ [name]: value, isValid });
  };

  handleSubmit = () => {
    const { submit, subscription } = this.props;
    submit(subscription.id, this.state);
  };

  handleClose = () => {
    const { closeModal } = this.props;
    closeModal();
  }

  handleSupportlevelChange = (name, value) => {
    const { onChangeSupportLevelCallback } = this.props;
    this.handleChange(name, value);
    onChangeSupportLevelCallback(value);
  }

  render() {
    const {
      isOpen,
      requestState,
      onClose,
      isDialog,
      onChangeNumericInputCallback,
      subscription,
      hideSubscriptionSettings,
    } = this.props;
    const radioGroupClassName = 'subscription-settings radio-group';
    const { [SUPPORT_LEVEL]: supportLevel, [SYSTEM_UNITS]: systemUnits, isValid } = this.state;

    const isDisabled = supportLevel !== PREMIUM
      && supportLevel !== STANDARD
      && supportLevel !== SELF_SUPPORT;

    const tooltipText = 'You cannot edit subscription settings because your organization does not have any OpenShift subscriptions. Contact sales to purchase OpenShift.';

    const subscriptionFieldsRegisterNewCluster = (
      <>
        <FormGroup className={radioGroupClassName} label="Choose the support type for this cluster.">
          <Field
            component={RadioButtons}
            name={SUPPORT_LEVEL}
            defaultValue={EVAL}
            options={this.options[SUPPORT_LEVEL]}
            isDisabled={hideSubscriptionSettings}
            onChangeCallback={this.handleSupportlevelChange}
          />
        </FormGroup>
        <FormGroup className={radioGroupClassName} label="How do you intend to use this cluster?">
          <Field
            component={RadioButtons}
            name={USAGE}
            defaultValue={PRODUCTION}
            options={this.options[USAGE]}
            isDisabled={isDisabled || hideSubscriptionSettings}
            onChangeCallback={this.handleChange}
          />
        </FormGroup>
        <FormGroup className={radioGroupClassName} label="Choose your service level. (If you bought your subscription through Red Hat, choose L1-L3.)">
          <Field
            component={RadioButtons}
            name={SERVICE_LEVEL}
            defaultValue={L1_L3}
            options={this.options[SERVICE_LEVEL]}
            isDisabled={isDisabled || hideSubscriptionSettings}
            onChangeCallback={this.handleChange}
          />
        </FormGroup>
        <FormGroup className={radioGroupClassName} label="What unit of measure do you want to use, cores/vCPU or sockets?">
          <Field
            component={UnitFields}
            name={SYSTEM_UNITS}
            defaultValue={CORES_VCPU}
            isDisabled={isDisabled || hideSubscriptionSettings}
            onChangeCallback={this.handleChange}
            onChangeNumericInputCallback={onChangeNumericInputCallback}
          />
        </FormGroup>
      </>
    );

    const editSubscriptionFields = (
      <>
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
        <FormGroup className={radioGroupClassName} label="What unit of measure do you want to use, cores/vCPU or sockets?">
          <UnitFields
            name={SYSTEM_UNITS}
            defaultValue={CORES_VCPU}
            isDisabled={isDisabled}
            onChangeCallback={this.handleChange}
            onChangeNumericInputCallback={this.handleChange}
            input={{ name: SYSTEM_UNITS, value: systemUnits, onChange: this.handleChange }}
            subscription={subscription}
          />
        </FormGroup>
      </>
    );

    if (!isDialog) {
      return hideSubscriptionSettings
        ? (
          <Tooltip
            content={tooltipText}
            position={TooltipPosition.auto}
          >
            <div>{subscriptionFieldsRegisterNewCluster}</div>
          </Tooltip>
        )
        : subscriptionFieldsRegisterNewCluster;
    }

    return isOpen && isDialog && (
    <Modal
      title="Subscription settings"
      width={810}
      variant="large"
      onClose={this.handleClose}
      primaryText="Save settings"
      secondaryText="Cancel"
      onPrimaryClick={this.handleSubmit}
      onSecondaryClick={this.handleClose}
      isPrimaryDisabled={requestState.pending || isDisabled || !isValid}
    >
      <EditSubscriptionSettingsRequestState
        requestState={requestState}
        onFulfilled={() => { this.handleClose(); onClose(); }}
      />
      <Form onSubmit={(e) => { this.handleSubmit(); e.preventDefault(); }} className="subscription-settings form">
        <TextContent>
          <Text component={TextVariants.p}>
          Editing the subscription settings will help ensure that
          you receive the level of support that you expect, and that
          your cluster is consuming the correct type of subscription.
          </Text>
        </TextContent>
        {editSubscriptionFields}
      </Form>
    </Modal>
    );
  }
}

EditSubscriptionSettingsDialog.propTypes = {
  subscription: PropTypes.object,
  requestState: PropTypes.object,
  isOpen: PropTypes.bool,
  hideSubscriptionSettings: PropTypes.bool,
  isDialog: PropTypes.bool,
  closeModal: PropTypes.func,
  submit: PropTypes.func,
  onClose: PropTypes.func,
  onChangeNumericInputCallback: PropTypes.func,
  onChangeSupportLevelCallback: PropTypes.func,
};

EditSubscriptionSettingsDialog.defaultProps = {
  isOpen: false,
  isDialog: true, // TODO FIXME this prop needs to be removed.
  hideSubscriptionSettings: true,
  subscription: {},
};

export default EditSubscriptionSettingsDialog;
