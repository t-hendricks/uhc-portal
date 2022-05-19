import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get, findIndex, isEqual } from 'lodash';
import {
  Alert,
  FormGroup,
  NumberInput,
  Tooltip,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';

import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { ReduxFormRadioGroup } from '../../../common/ReduxFormComponents';
import links from '../../../../common/installLinks.mjs';
import {
  subscriptionSettings,
  subscriptionSupportLevels,
  subscriptionServiceLevels,
  subscriptionUsages,
  subscriptionProductBundles,
  subscriptionSystemUnits,
  billingModels,
  subscriptionStatuses,
} from '../../../../common/subscriptionTypes';
import PopoverHint from '../../../common/PopoverHint';
import ExternalLink from '../../../common/ExternalLink';

const {
  SUPPORT_LEVEL,
  USAGE,
  SERVICE_LEVEL,
  PRODUCT_BUNDLE,
  SYSTEM_UNITS,
  CLUSTER_BILLING_MODEL,
  CPU_TOTAL,
  SOCKET_TOTAL,
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

const {
  STANDARD: STANDARD_BILLING_MODEL,
  MARKETPLACE: MARKETPLACE_BILLING_MODEL,
} = billingModels;

const { DISCONNECTED } = subscriptionStatuses;

const standardBillingModelLabel = 'Annual: Fixed capacity subscription from Red Hat';
const marketplaceBillingModelLabel = 'On-Demand (Hourly): Flexible usage billed through the Red Hat Marketplace';

const MIN_VAL = 1;
const MAX_VAL = 999;

class EditSubscriptionSettingsFields extends Component {
  state = { }

  options = {
    [SUPPORT_LEVEL]: [],
    [SERVICE_LEVEL]: [],
    [USAGE]: [],
    [SYSTEM_UNITS]: [],
    [CLUSTER_BILLING_MODEL]: [],
  }

  componentDidMount() {
    const { initialSettings } = this.props;
    this.doInit(initialSettings);
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { initialSettings: nextInitialSettings } = nextProps;
    const { initialSettings } = this.props;
    if (initialSettings !== nextInitialSettings && !isEqual(initialSettings, nextInitialSettings)) {
      this.doInit(nextInitialSettings);
    }
  }

  doInit = (initialSettings) => {
    const newState = this.resetOptions(initialSettings);
    // disconnected cluster additonally requires cpu_total/socket_total
    if (this.isDisconnected(initialSettings)) {
      newState[CPU_TOTAL] = get(initialSettings, CPU_TOTAL, 1);
      newState[SOCKET_TOTAL] = get(initialSettings, SOCKET_TOTAL, 1);
    }

    this.setState(newState, () => {
      const { [CLUSTER_BILLING_MODEL]: clusterBillingModel } = this.state;
      if (clusterBillingModel === MARKETPLACE_BILLING_MODEL) {
        // trigger field preset
        this.handleChange(CLUSTER_BILLING_MODEL, MARKETPLACE_BILLING_MODEL);
      } else {
        this.publishChange();
      }
    });
  }

  resetOptions = (subscription) => {
    const nextState = {};

    [
      SUPPORT_LEVEL,
      USAGE,
      SERVICE_LEVEL,
      SYSTEM_UNITS,
      CLUSTER_BILLING_MODEL,
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
    const { canSubscribeStandardOCP, canSubscribeMarketplaceOCP } = this.props;
    let options = [];
    switch (setting) {
      case SUPPORT_LEVEL:
        options = [
          { label: 'Premium', value: PREMIUM },
          { label: 'Standard', value: STANDARD },
          { label: 'Self-Support', value: SELF_SUPPORT },
        ];
        if (value === EVAL || !subscription.id) {
          options.push({
            label: 'Self-Support 60-day evaluation',
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
          { label: 'Development/Test', value: DEV_TEST },
          { label: 'Disaster Recovery', value: DISASTER_RECOVERY },
        ];
        break;
      case SERVICE_LEVEL:
        options = [
          { label: 'Red Hat support (L1-L3)', value: L1_L3, isDefault: true },
          { label: 'Partner support (L3)', value: L3_ONLY },
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
          { label: 'Cores/vCPUs', value: CORES_VCPU, isDefault: true },
          { label: 'Sockets', value: SOCKETS },
        ];
        break;
      case CLUSTER_BILLING_MODEL:
        options = [
          { label: standardBillingModelLabel, value: STANDARD_BILLING_MODEL },
          { label: marketplaceBillingModelLabel, value: MARKETPLACE_BILLING_MODEL },
        ];
        if (canSubscribeStandardOCP) {
          options[0].isDefault = true;
        } else if (canSubscribeMarketplaceOCP) {
          options[1].isDefault = true;
        } else { // default to standard if both are missing
          options[0].isDefault = true;
        }
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

  validateSystemUnitsNumericField = (inputVal = null) => {
    const {
      [SYSTEM_UNITS]: systemUnits,
      [CPU_TOTAL]: cpuTotal,
      [SOCKET_TOTAL]: socketTotal,
    } = this.state;

    const stringValue = inputVal || (systemUnits === SOCKETS ? socketTotal : cpuTotal);
    // validate that `value` consists of decimal digits only
    if (!/^\d+$/.test(`${stringValue}`)) {
      return {
        isValid: false,
        errorMsg: `${systemUnits} value can only be a positive integer number.`,
      };
    }
    // now value is number for sure
    const value = +stringValue;
    if (value < MIN_VAL) {
      return {
        isValid: false,
        errorMsg: `${systemUnits} value must be an integer number greater than ${MIN_VAL - 1}.`,
      };
    }
    if (value > MAX_VAL) {
      return {
        isValid: false,
        errorMsg: `${systemUnits} value must be an integer number no larger than ${MAX_VAL}.`,
      };
    }

    return { isValid: true, errorMsg: '' };
  }

  publishChange = () => {
    // support_level must be valid
    let isValid = true;
    const { initialSettings } = this.props;
    const { [SUPPORT_LEVEL]: supportLevel } = this.state;
    if (supportLevel !== PREMIUM && supportLevel !== STANDARD && supportLevel !== SELF_SUPPORT) {
      isValid = false;
    }
    // system_units must be valid for disconnected clusters
    if (isValid && this.isDisconnected(initialSettings)) {
      isValid = this.validateSystemUnitsNumericField().isValid;
    }
    const { onSettingsChange } = this.props;
    onSettingsChange({ ...this.state, isValid });
  }

  handleChange = (name, value) => {
    if (name === CLUSTER_BILLING_MODEL && value === MARKETPLACE_BILLING_MODEL) {
      // preset values for marketplace
      const { initialSettings } = this.props;
      const subSettings = {
        ...initialSettings,
        [SUPPORT_LEVEL]: PREMIUM,
        [SERVICE_LEVEL]: L1_L3,
        [USAGE]: PRODUCTION,
        [SYSTEM_UNITS]: CORES_VCPU,
        [CLUSTER_BILLING_MODEL]: MARKETPLACE_BILLING_MODEL,
      };
      this.setState(this.resetOptions(subSettings), this.publishChange);
    } else {
      this.setState({ [name]: value }, this.publishChange);
    }
  };

  handleUnitsNumberChange = (event) => {
    const { name, value: rawValue } = event.target;
    const value = Number(rawValue);
    const { isValid } = this.validateSystemUnitsNumericField(value);
    if (isValid) {
      this.handleChange(name, parseInt(value, 10));
    } else {
      this.handleChange(name, rawValue);
    }
  };

  handleUnitsNumberDelta = (delta) => {
    const handler = (_, name) => {
      const { [name]: value } = this.state;
      const { isValid } = this.validateSystemUnitsNumericField(value);
      if (isValid) {
        this.handleChange(name, parseInt(value + delta, 10));
      } else {
        this.handleChange(name, MIN_VAL);
      }
    };
    return handler;
  };

  isDisconnected = settings => (get(settings, 'status') === DISCONNECTED || !get(settings, 'id', false));

  render() {
    const {
      initialSettings,
      canSubscribeStandardOCP,
      canSubscribeMarketplaceOCP,
    } = this.props;

    const {
      [CLUSTER_BILLING_MODEL]: clusterBillingModel,
      [SUPPORT_LEVEL]: supportLevel,
      [SYSTEM_UNITS]: systemUnits,
    } = this.state;

    const isDisabled = !canSubscribeStandardOCP && !canSubscribeMarketplaceOCP;
    const isDisabledBySupportLevel = supportLevel !== PREMIUM
      && supportLevel !== STANDARD
      && supportLevel !== SELF_SUPPORT;
    const isDisabledByBillingModel = clusterBillingModel === MARKETPLACE_BILLING_MODEL;

    // the billing_model options are visible only when,
    // (1) it has both capabilities, and
    // (2) it's not already set.
    const billingModel = get(initialSettings, CLUSTER_BILLING_MODEL);
    const isBillingModelVisible = canSubscribeStandardOCP
      && canSubscribeMarketplaceOCP
      && billingModel !== STANDARD_BILLING_MODEL
      && billingModel !== MARKETPLACE_BILLING_MODEL;

    // provide alert text per its context
    let billingModelAlertText = 'Your subscription type can\'t be altered after you set it.';
    if (!isBillingModelVisible) {
      if (billingModel === STANDARD_BILLING_MODEL) {
        billingModelAlertText = `Cluster subscription type is ${standardBillingModelLabel}`;
      } else if (billingModel === MARKETPLACE_BILLING_MODEL || canSubscribeMarketplaceOCP) {
        billingModelAlertText = `Cluster subscription type is ${marketplaceBillingModelLabel}`;
      } else if (this.isDisconnected(initialSettings)) {
        billingModelAlertText = `Disconnected clusters subscription type is ${standardBillingModelLabel}`;
      } else {
        billingModelAlertText = `Cluster subscription type is ${standardBillingModelLabel}`;
      }
    }
    const billingModelAlert = (
      <Alert
        id="subscription-settings-cluster-billing-model-alert"
        variant="info"
        isInline
        title={billingModelAlertText}
      >
        <a href={links.OCM_DOCS_SUBSCRIPTIONS} target="_blank" rel="noreferrer noopener">
          Learn more about subscriptions
          {' '}
          <ExternalLinkAltIcon color="#0066cc" size="sm" />
        </a>
      </Alert>
    );

    // tooltips on these radio selection groups when pre-set values are used.
    const radioGroupClasses = ['subscription-settings', 'radio-group'];
    const radioGroupClassName = radioGroupClasses.join(' ');
    let tooltips = null;
    if (isDisabledByBillingModel) {
      const radioGroupSelector = `.${radioGroupClasses.join('.')} .pf-c-form__group-control`;
      // we need the tip on all the 4 form groups
      const startPos = isBillingModelVisible ? 1 : 0;
      const radioGroupComponents = [0, 1, 2, 3].map(idx => (
        <Tooltip
          key={idx}
          content={
            <div>Red Hat Marketplace subscription settings are pre-set and cannot be altered.</div>
          }
          position="right"
          reference={() => {
            const groupEls = document.querySelectorAll(radioGroupSelector);
            const groupPos = startPos + idx;
            if (groupPos < groupEls.length) {
              return groupEls[groupPos];
            }
            // eslint-disable-next-line no-console
            console.error(`Edit Subscription tooltip: error selecting ${radioGroupSelector} (${groupPos})`);
            return null;
          }}
        />
      ));
      tooltips = <>{radioGroupComponents}</>;
    }

    // show validation error on system_units numeric input for disconnected clusters
    const isDisconnectedSub = this.isDisconnected(initialSettings);
    let systemUnitsNumericIsValid = true;
    let systemUnitsNumericErrorMsg = '';
    if (isDisconnectedSub) {
      const validationResult = this.validateSystemUnitsNumericField();
      systemUnitsNumericIsValid = validationResult.isValid;
      systemUnitsNumericErrorMsg = validationResult.errorMsg;
    }

    // cpu/socket totals are editable for disconnected clusters
    const cpuTotal = isDisconnectedSub
      ? get(this.state, CPU_TOTAL, 0)
      : get(initialSettings, CPU_TOTAL, 0);
    const socketTotal = isDisconnectedSub
      ? get(this.state, SOCKET_TOTAL, 0)
      : get(initialSettings, SOCKET_TOTAL, 0);

    // popup tooltips on the labels
    const labelIconClass = 'subscription-settings-label-tooltip-icon';
    const supportLevelLabel = (
      <>
        <span>Service level agreement (SLA)</span>
        <PopoverHint
          id="subscripiton-settings-support-level-hint"
          headerContent="Service level agreement (SLA)"
          hint={(
            <TextContent>
              <Text component={TextVariants.p}>
                How your subscription is supported, including the hours
                of support coverage and support ticket response times.
              </Text>
              <Text component={TextVariants.p}>
                <ExternalLink href="https://access.redhat.com/support/">
                  Production Support Terms of Service
                </ExternalLink>
              </Text>
            </TextContent>
          )}
          iconClassName={labelIconClass}
          hasAutoWidth
          maxWidth="30.0rem"
        />
      </>
    );
    const serviceLevelLabel = (
      <>
        <span>Support type</span>
        <PopoverHint
          id="subscripiton-settings-service-level-hit"
          headerContent="Support type"
          hint={(
            <TextContent>
              <Text component={TextVariants.p}>
                Who you can call for primary support.
              </Text>
            </TextContent>
          )}
          iconClassName={labelIconClass}
        />
      </>
    );
    const usageLabel = (
      <>
        <span>Cluster usage</span>
        <PopoverHint
          id="subscripiton-settings-usage-hint"
          headerContent="Cluster usage"
          hint={(
            <TextContent>
              <Text component={TextVariants.p}>
                How you are using this cluster.
              </Text>
            </TextContent>
          )}
          iconClassName={labelIconClass}
        />
      </>
    );
    const systemUnitsLabel = (
      <>
        <span>Subscription units</span>
        <PopoverHint
          id="subscripiton-settings-system-units-hint"
          headerContent="Subscription units"
          hint={(
            <TextContent>
              <Text component={TextVariants.p}>
                How usage is measured for your subscription.
              </Text>
            </TextContent>
          )}
          iconClassName={labelIconClass}
        />
      </>
    );

    // the number field for CPU/vCores or Socket
    const cpuSocketValue = systemUnits === SOCKETS ? socketTotal : cpuTotal;
    const CpuSocketNumberField = isDisconnectedSub ? (
      <NumberInput
        value={cpuSocketValue}
        min={MIN_VAL}
        max={MAX_VAL}
        inputName={systemUnits === SOCKETS ? SOCKET_TOTAL : CPU_TOTAL}
        isDisabled={isDisabled
          || isDisabledByBillingModel
          || isDisabledBySupportLevel}
        onMinus={this.handleUnitsNumberDelta(-1)}
        onPlus={this.handleUnitsNumberDelta(1)}
        onChange={this.handleUnitsNumberChange}
        inputAriaLabel={systemUnits === SOCKETS ? 'Number of sockets' : 'Number of compute cores (excluding control plane nodes)'}
        minusBtnAriaLabel="decrement the number by 1"
        plusBtnAriaLabel="increment the number by 1"
        widthChars={MAX_VAL.toString().length}
      />
    ) : (
      <>
        <span id="cpu-socket-value">{`${cpuSocketValue} ${systemUnits === SOCKETS ? 'Sockets' : 'Cores/vCPU'}`}</span>
        <PopoverHint
          id="cpu-socket-value-hint"
          hint="This data is gathered directly from the telemetry metrics submitted by the cluster and cannot be changed."
          iconClassName={labelIconClass}
          hasAutoWidth
          maxWidth="30.0rem"
        />
      </>
    );

    return (
      <>
        {isBillingModelVisible && (
          <ReduxFormRadioGroup
            name={CLUSTER_BILLING_MODEL}
            fieldId={CLUSTER_BILLING_MODEL}
            isRequired
            label="Subscription type"
            className={radioGroupClassName}
            items={this.options[CLUSTER_BILLING_MODEL]}
            onChange={this.handleChange}
          />
        )}
        {!isDisabled && billingModelAlert}
        <ReduxFormRadioGroup
          name={SUPPORT_LEVEL}
          fieldId={SUPPORT_LEVEL}
          label={supportLevelLabel}
          className={radioGroupClassName}
          items={this.options[SUPPORT_LEVEL]}
          onChange={this.handleChange}
          isDisabled={isDisabled || isDisabledByBillingModel}
        />
        <ReduxFormRadioGroup
          name={SERVICE_LEVEL}
          fieldId={SERVICE_LEVEL}
          label={serviceLevelLabel}
          className={radioGroupClassName}
          items={this.options[SERVICE_LEVEL]}
          onChange={this.handleChange}
          isDisabled={isDisabled || isDisabledByBillingModel || isDisabledBySupportLevel}
        />
        <ReduxFormRadioGroup
          name={USAGE}
          fieldId={USAGE}
          label={usageLabel}
          className={radioGroupClassName}
          items={this.options[USAGE]}
          onChange={this.handleChange}
          isDisabled={isDisabled || isDisabledByBillingModel || isDisabledBySupportLevel}
        />
        <ReduxFormRadioGroup
          name={SYSTEM_UNITS}
          fieldId={SYSTEM_UNITS}
          label={systemUnitsLabel}
          className={radioGroupClassName}
          items={this.options[SYSTEM_UNITS]}
          onChange={this.handleChange}
          isDisabled={isDisabled || isDisabledByBillingModel || isDisabledBySupportLevel}
          isInline
        />
        <FormGroup
          label={systemUnits === SOCKETS ? 'Number of sockets' : 'Number of compute cores (excluding control plane nodes)'}
          isRequired={isDisconnectedSub}
          helperText={isDisconnectedSub ? `${systemUnits} value can be any integer number between ${MIN_VAL}-${MAX_VAL}` : ''}
          helperTextInvalid={systemUnitsNumericErrorMsg}
          validated={systemUnitsNumericIsValid ? 'default' : 'error'}
        >
          {CpuSocketNumberField}
        </FormGroup>
        {tooltips}
      </>
    );
  }
}

EditSubscriptionSettingsFields.propTypes = {
  initialSettings: PropTypes.object,
  onSettingsChange: PropTypes.func.isRequired,
  canSubscribeMarketplaceOCP: PropTypes.bool,
  canSubscribeStandardOCP: PropTypes.bool,
};

EditSubscriptionSettingsFields.defaultProps = {
  initialSettings: { [SUPPORT_LEVEL]: EVAL },
};

export default EditSubscriptionSettingsFields;
