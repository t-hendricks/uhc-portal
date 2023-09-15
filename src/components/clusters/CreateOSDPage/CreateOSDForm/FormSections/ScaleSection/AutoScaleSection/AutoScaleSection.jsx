// eslint-disable-next-line max-classes-per-file
import React from 'react';
import PropTypes from 'prop-types';
import {
  NumberInput,
  FormGroup,
  GridItem,
  Split,
  SplitItem,
  HelperText,
  HelperTextItem,
} from '@patternfly/react-core';
import { Field } from 'redux-form';

import './AutoScale.scss';
import getMinNodesAllowed, { computeNodeHintText } from './AutoScaleHelper';
import ReduxCheckbox from '../../../../../../common/ReduxFormComponents/ReduxCheckbox';
import ExternalLink from '../../../../../../common/ExternalLink';
import PopoverHint from '../../../../../../common/PopoverHint';
import links from '../../../../../../../common/installLinks.mjs';
import { validateNumericInput, required } from '../../../../../../../common/validators';
import { constants } from '../../../CreateOSDFormConstants';
import { normalizedProducts } from '../../../../../../../common/subscriptionTypes';
import { MAX_NODES } from '../../../../../common/NodeCountInput/NodeCountInput';

const minHypershiftNodesPerPool = (numPools) => (numPools > 1 ? 1 : 2);

class NodesInput extends React.Component {
  componentDidUpdate() {
    const {
      meta: { touched, error },
      displayError,
      hideError,
      limit,
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

  onButtonPress = (plus) => {
    const {
      min,
      max,
      input: { value },
    } = this.props;
    // base cases
    if (Number.isNaN(parseInt(value, 10))) {
      // empty field, then pressing a button
      return this.updateReduxField(min + 1);
    }
    if (parseInt(value, 10) < min) {
      // user entered a value that is less than min, then pressing a button
      return this.updateReduxField(min);
    }
    if (parseInt(value, 10) > max) {
      // user entered a value greater than max, then pressing a button
      return this.updateReduxField(max);
    }

    // normal cases
    if (plus) {
      // user pressed the plus button
      return this.updateReduxField(parseInt(value, 10) + 1);
    }
    // user pressed the minus button
    return this.updateReduxField(parseInt(value, 10) - 1);
  };

  onMinus = () => this.onButtonPress(false);

  onPlus = () => this.onButtonPress(true);

  render() {
    const {
      input: { value, onBlur },
      ariaLabel,
      min,
      max,
    } = this.props;
    return (
      <NumberInput
        value={parseInt(value, 10) || 0}
        min={min}
        max={max}
        onMinus={this.onMinus}
        onChange={this.onChange}
        onPlus={this.onPlus}
        inputAriaLabel={ariaLabel}
        widthChars={4}
        inputProps={{
          onBlur: (e) => {
            // strips unnecessary leading zeros
            // https://issues.redhat.com/browse/HAC-830
            // eslint-disable-next-line no-param-reassign
            e.target.value = Number(e.target.value).toString();
            onBlur(e);
          },
        }}
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
  };

  componentDidUpdate(prevProps) {
    const {
      autoscalingEnabled,
      change,
      isDefaultMachinePool,
      product,
      isBYOC,
      isMultiAz,
      autoScaleMinNodesValue,
      autoScaleMaxNodesValue,
      minNodesRequired,
      isHypershiftWizard,
      numPools,
    } = this.props;

    if (!prevProps.autoscalingEnabled && autoscalingEnabled) {
      const defaultMinAllowed = isHypershiftWizard
        ? minHypershiftNodesPerPool(numPools)
        : minNodesRequired;

      const minAllowed = getMinNodesAllowed({
        isDefaultMachinePool,
        product,
        isBYOC,
        isMultiAz,
        autoScaleMinNodesValue,
        defaultMinAllowed,
        isHypershiftWizard,
      });
      const defaultReplicas = isMultiAz && !isHypershiftWizard ? minAllowed / 3 : minAllowed;

      const minAutoscaleValue = autoScaleMinNodesValue ? parseInt(autoScaleMinNodesValue, 10) : 0;

      const min = minAutoscaleValue < defaultReplicas ? defaultReplicas : minAutoscaleValue;

      change('min_replicas', `${min}`);
      if (!autoScaleMaxNodesValue || parseInt(autoScaleMaxNodesValue, 10) < min) {
        change('max_replicas', `${min}`);
      }
    }

    if (isHypershiftWizard && numPools !== prevProps.numPools) {
      const defaultMinPools = minHypershiftNodesPerPool(numPools);
      if (
        (autoScaleMinNodesValue && autoScaleMinNodesValue < defaultMinPools) ||
        (autoScaleMaxNodesValue && autoScaleMaxNodesValue > this.maxNodes())
      ) {
        change('min_replicas', defaultMinPools.toString());
        change('max_replicas', defaultMinPools.toString());
      }
    }
  }

  displayError = (lim, validationMessage) =>
    this.setState({ [`${lim}ErrorMessage`]: validationMessage });

  hideError = (lim) => this.setState({ [`${lim}ErrorMessage`]: undefined });

  minNodes = () => {
    const {
      isDefaultMachinePool,
      product,
      isBYOC,
      isMultiAz,
      minNodesRequired,
      isHypershiftWizard,
      numPools,
    } = this.props;

    const defaultMinAllowed = isHypershiftWizard
      ? minHypershiftNodesPerPool(numPools)
      : minNodesRequired;

    return (
      getMinNodesAllowed({
        isDefaultMachinePool,
        product,
        isBYOC,
        isMultiAz,
        autoScaleMinNodesValue: null,
        defaultMinAllowed,
      }) / (isMultiAz && !isHypershiftWizard ? 3 : 1)
    );
  };

  maxNodes = () => {
    const { isMultiAz, isHypershiftWizard, numPools } = this.props;

    if (isHypershiftWizard) {
      return MAX_NODES / numPools;
    }
    if (isMultiAz) {
      return MAX_NODES / 3;
    }
    return MAX_NODES;
  };

  validateMinNodes = (val) => {
    const minNodesAllowed = this.minNodes();
    return validateNumericInput(val, { min: minNodesAllowed, allowZero: true });
  };

  validateMaxLessMinNodes = (val, allValues) => {
    if (parseInt(val, 10) < parseInt(allValues.min_replicas, 10)) {
      return 'Max nodes cannot be less than min nodes.';
    }
    return undefined;
  };

  validateMaxNodes = (val) =>
    validateNumericInput(val, {
      max: this.maxNodes(),
      allowZero: true,
    });

  render() {
    const {
      autoscalingEnabled,
      isMultiAz,
      autoScaleMinNodesValue,
      autoScaleMaxNodesValue,
      product,
      onChange,
      isHypershiftWizard,
      isHypershiftMachinePool,
      numPools,
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
        max={this.maxNodes()}
      />
    );

    const maxField = (
      <Field
        component={NodesInput}
        name="max_replicas"
        type="text"
        ariaLabel="Maximum nodes"
        validate={[
          this.validateMinNodes,
          this.validateMaxLessMinNodes,
          this.validateMaxNodes,
          required,
        ]}
        displayError={this.displayError}
        hideError={this.hideError}
        limit="max"
        min={this.minNodes()}
        max={this.maxNodes()}
      />
    );

    const errorText = (message) => (
      <HelperTextItem variant="error" hasIcon>
        {message}
      </HelperTextItem>
    );
    const helpText = (message) => <HelperTextItem>{message}</HelperTextItem>;

    const isRosa = product === normalizedProducts.ROSA;

    const autoScalingUrl = isRosa ? links.ROSA_AUTOSCALING : links.APPLYING_AUTOSCALING;

    const minNodesLabel = () => {
      if (isHypershiftWizard) {
        return 'Minimum nodes per machine pool';
      }
      if (isMultiAz) {
        return 'Minimum nodes per zone';
      }
      return 'Minimum node count';
    };

    const maxNodesLabel = () => {
      if (isHypershiftWizard) {
        return 'Maximum nodes per machine pool';
      }
      if (isMultiAz) {
        return 'Maximum nodes per zone';
      }
      return 'Maximum node count';
    };

    const nodesHelpText = (nodes = '0') => {
      if (isHypershiftWizard) {
        return helpText(`x ${numPools} machine pools = ${parseInt(nodes, 10) * numPools}`);
      }
      if (isMultiAz) {
        return helpText(`x 3 zones = ${parseInt(nodes, 10) * 3}`);
      }
      return null;
    };

    const azFormGroups = (
      <>
        <Split hasGutter className="autoscaling__container">
          <SplitItem>
            <FormGroup
              label={minNodesLabel()}
              isRequired
              fieldId="nodes_min"
              className="autoscaling__nodes-formGroup"
              helperText={
                <HelperText>
                  {nodesHelpText(autoScaleMinNodesValue)}
                  {minErrorMessage && errorText(minErrorMessage)}
                </HelperText>
              }
            >
              {minField}
            </FormGroup>
          </SplitItem>
          <SplitItem>
            <FormGroup
              label={maxNodesLabel()}
              isRequired
              fieldId="nodes_max"
              className="autoscaling__nodes-formGroup"
              helperText={
                <HelperText>
                  {nodesHelpText(autoScaleMaxNodesValue)}
                  {maxErrorMessage && errorText(maxErrorMessage)}
                </HelperText>
              }
              labelIcon={
                <PopoverHint
                  buttonAriaLabel="Compute node count information"
                  hint={
                    <>
                      {computeNodeHintText(isHypershiftWizard, isHypershiftMachinePool)}
                      <br />
                      {isRosa ? (
                        <>
                          <ExternalLink href={links.ROSA_WORKER_NODE_COUNT}>
                            Learn more about worker/compute node count
                          </ExternalLink>
                          <br />
                        </>
                      ) : null}
                    </>
                  }
                />
              }
            >
              {maxField}
            </FormGroup>
          </SplitItem>
        </Split>
      </>
    );

    return (
      <>
        <GridItem id="autoscaling">
          <FormGroup
            fieldId="autoscaling"
            label="Autoscaling"
            labelIcon={
              <PopoverHint
                hint={
                  <>
                    {constants.autoscaleHint}{' '}
                    <ExternalLink href={autoScalingUrl}>
                      Learn more about autoscaling
                      {isRosa ? ' with ROSA' : ''}
                    </ExternalLink>
                  </>
                }
              />
            }
          />
          <Field
            component={ReduxCheckbox}
            name="autoscalingEnabled"
            label="Enable autoscaling"
            helpText="Autoscaling automatically adds and removes worker (compute) nodes from the cluster based on resource requirements."
            onChange={onChange}
          />
          {autoscalingEnabled && azFormGroups}
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
  minNodesRequired: PropTypes.number,
  isHypershiftWizard: PropTypes.bool,
  isHypershiftMachinePool: PropTypes.bool,
  numPools: PropTypes.number,
};

AutoScaleSection.defaultProps = {
  onChange: () => {},
};

export default AutoScaleSection;
