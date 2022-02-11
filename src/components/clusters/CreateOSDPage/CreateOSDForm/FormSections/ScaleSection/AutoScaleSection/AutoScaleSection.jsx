// eslint-disable-next-line max-classes-per-file
import React from 'react';
import PropTypes from 'prop-types';
import {
  NumberInput, FormGroup, GridItem, Split, SplitItem, HelperText, HelperTextItem,
} from '@patternfly/react-core';
import { Field } from 'redux-form';

import './AutoScale.scss';
import getMinNodesAllowed from './AutoScaleHelper';
import ReduxCheckbox from '../../../../../../common/ReduxFormComponents/ReduxCheckbox';
import ExternalLink from '../../../../../../common/ExternalLink';
import PopoverHint from '../../../../../../common/PopoverHint';
import { validateNumericInput, required } from '../../../../../../../common/validators';
import { constants } from '../../../CreateOSDFormConstants';
import { normalizedProducts } from '../../../../../../../common/subscriptionTypes';
import { MAX_NODES } from '../../../../../common/NodeCountInput/NodeCountInput';

class NodesInput extends React.Component {
  componentDidUpdate() {
    const {
      meta: { touched, error }, displayError, hideError, limit,
    } = this.props;
    if (touched && error) {
      displayError(limit, error);
    } else {
      hideError(limit);
    }
  }

  updateReduxField = (value) => {
    const {
      input: { onBlur, onChange },
    } = this.props;
    onChange(`${value}`);
    // informs redux-form that the input has been touched
    onBlur();
  };

  onChange = (event) => {
    this.updateReduxField(Number(event.target.value));
  };

  onMinus = () => {
    const {
      min,
      input: {
        value,
      },
    } = this.props;
    if (parseInt(value, 10) === Number.isNaN || parseInt(value, 10) < min) {
      // user got here by entering a value that is less than min, then pressing the minus button
      return this.updateReduxField(min);
    }
    const newValue = (parseInt(value, 10) || (min + 1)) - 1;
    return this.updateReduxField(newValue);
  };

  onPlus = () => {
    const {
      min, input: {
        value,
      },
    } = this.props;
    if (parseInt(value, 10) === Number.isNaN || parseInt(value, 10) > MAX_NODES) {
      // user got here by entering a value that is greater than MAX_NODES,
      // then pressing the plus button
      return this.updateReduxField(MAX_NODES);
    }
    const newValue = (parseInt(value, 10) || min) + 1;
    return this.updateReduxField(newValue);
  };

  render() {
    const {
      input: { value }, ariaLabel, min, max,
    } = this.props;
    return (
      <NumberInput
        value={parseInt(value, 10)}
        min={min}
        max={max}
        onMinus={this.onMinus}
        onChange={this.onChange}
        onPlus={this.onPlus}
        inputAriaLabel={ariaLabel}
        widthChars={4}
      />
    );
  }
}

NodesInput.propTypes = {
  input: PropTypes.object.isRequired,
  meta: PropTypes.shape({
    error: PropTypes.string,
    touched: PropTypes.bool,
  }),
  ariaLabel: PropTypes.string.isRequired,
  displayError: PropTypes.func.isRequired,
  hideError: PropTypes.func.isRequired,
  limit: PropTypes.string.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
};

class AutoScaleSection extends React.Component {
  state = {
    minErrorMessage: undefined,
    maxErrorMessage: undefined,
  }

  componentDidUpdate(prevProps) {
    const {
      autoscalingEnabled, change, isDefaultMachinePool, product, isBYOC, isMultiAz,
    } = this.props;
    if (!prevProps.autoscalingEnabled && autoscalingEnabled) {
      const { autoScaleMinNodesValue } = this.props;
      const minAllowed = getMinNodesAllowed({
        isDefaultMachinePool,
        product,
        isBYOC,
        isMultiAz,
        autoScaleMinNodesValue,
      });
      // updates the min input value
      change('min_replicas', isMultiAz ? (minAllowed / 3).toString() : minAllowed.toString());
    }
  }

  displayError = (lim, validationMessage) => this.setState({ [`${lim}ErrorMessage`]: validationMessage });

  hideError = lim => this.setState({ [`${lim}ErrorMessage`]: undefined });

  minNodes = () => {
    const {
      isDefaultMachinePool, product, isBYOC, isMultiAz,
    } = this.props;
    return getMinNodesAllowed({
      isDefaultMachinePool, product, isBYOC, isMultiAz,
    }) / (isMultiAz ? 3 : 1);
  }

  validateMinNodes = (val) => {
    const minNodesAllowed = this.minNodes(val);
    return validateNumericInput(
      val, { min: minNodesAllowed, allowZero: true },
    );
  }

  validateMaxLessMinNodes = (val, allValues) => {
    if (parseInt(val, 10) < parseInt(allValues.min_replicas, 10)) {
      return 'Max nodes cannot be less than min nodes.';
    }
    return undefined;
  };

  validateMaxNodes = (val) => {
    const {
      isMultiAz,
    } = this.props;
    return validateNumericInput(val, {
      max: isMultiAz ? MAX_NODES / 3 : MAX_NODES,
      allowZero: true,
    });
  };

  onChange = (event) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(event);
    }
  }

  render() {
    const {
      autoscalingEnabled,
      isMultiAz,
      autoScaleMinNodesValue,
      autoScaleMaxNodesValue,
      product,
    } = this.props;
    const { minErrorMessage, maxErrorMessage } = this.state;

    const minField = (
      <Field
        component={NodesInput}
        name="min_replicas"
        type="text"
        ariaLabel="Minimum nodes"
        validate={[this.validateMinNodes, this.validateMaxNodes, required]}
        displayError={this.displayError}
        hideError={this.hideError}
        limit="min"
        min={this.minNodes()}
        max={isMultiAz ? MAX_NODES / 3 : MAX_NODES}
      />
    );

    const maxField = (
      <Field
        component={NodesInput}
        name="max_replicas"
        type="text"
        ariaLabel="Maximum nodes"
        validate={[this.validateMaxLessMinNodes, this.validateMaxNodes, required]}
        displayError={this.displayError}
        hideError={this.hideError}
        limit="max"
        min={this.minNodes()}
        max={isMultiAz ? MAX_NODES / 3 : MAX_NODES}
      />
    );

    const errorText = message => <HelperTextItem variant="error" hasIcon>{message}</HelperTextItem>;
    const helpText = message => <HelperTextItem>{message}</HelperTextItem>;

    const multiAzFormGroups = (
      <>
        <Split hasGutter className="autoscaling__container">
          <SplitItem>
            <FormGroup
              label="Minimum nodes per zone"
              isRequired
              fieldId="nodes_min_multiAZ"
              className="autoscaling__nodes-formGroup"
              helperText={(
                <HelperText>
                  {helpText(`x 3 zones = ${(parseInt(autoScaleMinNodesValue, 10) * 3)}`)}
                  {minErrorMessage && errorText(minErrorMessage)}
                </HelperText>
              )}
            >
              {minField}
            </FormGroup>
          </SplitItem>
          <SplitItem>
            <FormGroup
              label="Maximum nodes per zone"
              isRequired
              fieldId="nodes_max_multiAZ"
              className="autoscaling__nodes-formGroup"
              helperText={(
                <HelperText>
                  {helpText(`x 3 zones = ${(parseInt(autoScaleMaxNodesValue, 10) * 3)}`)}
                  {maxErrorMessage && errorText(maxErrorMessage)}
                </HelperText>
              )}
            >
              {maxField}
            </FormGroup>
          </SplitItem>
        </Split>
      </>
    );

    const singleAzFormGroup = (
      <>
        <FormGroup
          label="Minimum and maximum node count"
          isRequired
          fieldId="nodes_limit"
          className="autoscaling__container"
        >
          <Split hasGutter>
            <SplitItem className="autoscaling__nodes-formGroup">
              {minField}
              <HelperText>
                {helpText('minimum')}
                {minErrorMessage && errorText(minErrorMessage)}
              </HelperText>
            </SplitItem>
            <SplitItem className="autoscaling__nodes-formGroup">
              {maxField}
              <HelperText>
                {helpText('maximum')}
                {maxErrorMessage && errorText(maxErrorMessage)}
              </HelperText>
            </SplitItem>
          </Split>
        </FormGroup>
      </>
    );

    const autoScalingUrl = product === normalizedProducts.ROSA ? 'https://docs.openshift.com/rosa/nodes/nodes-about-autoscaling-nodes.html' : 'https://docs.openshift.com/container-platform/4.9/machine_management/applying-autoscaling.html';

    return (
      <>
        <GridItem id="autoscaling">
          <FormGroup
            fieldId="autoscaling"
            label="Autoscaling"
            labelIcon={(
              <PopoverHint
                hint={(
                  <>
                    {constants.autoscaleHint}
                    {' '}
                    <ExternalLink href={autoScalingUrl}>Learn more about autoscaling</ExternalLink>
                  </>
                )}
              />
            )}
          />
          <Field
            component={ReduxCheckbox}
            name="autoscalingEnabled"
            label="Enable autoscaling"
            onChange={this.onChange}
          />
          {autoscalingEnabled && (isMultiAz ? multiAzFormGroups : singleAzFormGroup)}
        </GridItem>
      </>
    );
  }
}

AutoScaleSection.propTypes = {
  autoscalingEnabled: PropTypes.bool.isRequired,
  isMultiAz: PropTypes.bool.isRequired,
  autoScaleMinNodesValue: PropTypes.string,
  autoScaleMaxNodesValue: PropTypes.string,
  product: PropTypes.string.isRequired,
  isBYOC: PropTypes.bool.isRequired,
  isDefaultMachinePool: PropTypes.bool.isRequired,
  change: PropTypes.func.isRequired,
  onChange: PropTypes.func,
};

AutoScaleSection.defaultProps = {
  autoScaleMinNodesValue: '0',
  autoScaleMaxNodesValue: '0',
};

export default AutoScaleSection;
