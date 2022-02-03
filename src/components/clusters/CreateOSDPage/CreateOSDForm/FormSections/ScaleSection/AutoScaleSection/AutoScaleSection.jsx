// eslint-disable-next-line max-classes-per-file
import React from 'react';
import PropTypes from 'prop-types';
import {
  NumberInput, TextInput, FormGroup, GridItem, Split, SplitItem,
} from '@patternfly/react-core';
import { Field } from 'redux-form';

import './AutoScale.scss';
import getMinNodesAllowed from './AutoScaleHelper';
import ReduxCheckbox from '../../../../../../common/ReduxFormComponents/ReduxCheckbox';
import ExternalLink from '../../../../../../common/ExternalLink';
import PopoverHint from '../../../../../../common/PopoverHint';
import { validateNumericInput, required } from '../../../../../../../common/validators';
import { constants } from '../../../CreateOSDFormConstants';

class NodesInput extends React.Component {
  minValue = 0;

  maxValue = 180;

  constructor(props) {
    super(props);
    this.state = {
      value: 0,
    };

    this.onMinus = () => {
      this.setState(prevState => ({ value: prevState.value - 1 }));
    };

    this.onChange = (event) => {
      let newValue = Number.isNaN(event.target.value) ? 0 : Number(event.target.value);
      newValue = newValue > this.maxValue ? this.maxValue : newValue < this.minValue ? this.minValue : newValue;
      this.setState({
        value: newValue,
      });
    };

    this.onPlus = () => {
      this.setState(prevState => ({ value: prevState.value + 1 }));
    };
  }

  // onMinus = () => {
  //   this.setState({
  //     value: this.state.value - 1,
  //   });
  // };

  // onChange = (event) => {
  //   const newValue = Number.isNaN(event.target.value) ? 0 : Number(event.target.value);
  //   this.setState({
  //     value: newValue > this.maxValue ? this.maxValue : newValue < this.minValue ? this.minValue : newValue,
  //   });
  // };

  // onPlus = () => {
  //   debugger;
  //   this.setState({
  //     value: this.state.value + 1,
  //   });
  // };

  componentDidUpdate() {
    const {
      meta: { touched, error }, displayError, hideError, limit,
    } = this.props;
    debugger;
    if (touched && error) {
      displayError(limit, error);
    } else {
      hideError(limit);
    }
  }

  render() {
    const { input, meta: { touched, error }, ariaLabel } = this.props;
    const { value } = this.state;
    return (
      <NumberInput
        {...input}
        value={value}
        min={this.minValue}
        max={this.maxValue}
        onMinus={this.onMinus}
        onChange={this.onChange}
        onPlus={this.onPlus}
        inputAriaLabel={ariaLabel}
        // unit={<span>{`x 3 zones = ${(value * 3)}`}</span>}
        widthChars={3}
      />
      // <TextInput
      //   aria-label={ariaLabel}
      //   validated={touched && error ? 'error' : 'default'}
      //   {...input}
      // />
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
};

class AutoScaleSection extends React.Component {
  state = {
    // minErrorMessage: undefined,
    // maxErrorMessage: undefined,
    minErrorMessage: 'There was an error with the minimum number of nodes',
    maxErrorMessage: 'There was an error with the maximum number of nodes',
  }

  componentDidUpdate(prevProps) {
    const {
      autoscalingEnabled, change, isDefaultMachinePool, product, isBYOC, isMultiAz,
    } = this.props;
    if (!prevProps.autoscalingEnabled && autoscalingEnabled) {
      const { autoScaleMinNodesValue } = this.props;
      debugger;
      const minAllowed = getMinNodesAllowed({
        isDefaultMachinePool,
        product,
        isBYOC,
        isMultiAz,
        autoScaleMinNodesValue,
      });
      change('min_replicas', isMultiAz ? (minAllowed / 3).toString() : minAllowed.toString());
    }
  }

  displayError = (lim, vaildationMessage) => this.setState({ [`${lim}ErrorMessage`]: vaildationMessage });

  hideError = lim => this.setState({ [`${lim}ErrorMessage`]: undefined });

  validateMinNodes = (val) => {
    const {
      isDefaultMachinePool, product, isBYOC, isMultiAz,
    } = this.props;
    const minNodesAllowed = getMinNodesAllowed({
      val, isDefaultMachinePool, product, isBYOC, isMultiAz,
    });
    return validateNumericInput(
      val, { min: isMultiAz ? minNodesAllowed / 3 : minNodesAllowed, allowZero: true },
    );
  }

  validateMaxNodes = (val, allValues) => {
    if (parseInt(val, 10) < parseInt(allValues.min_replicas, 10)) {
      return 'Max nodes cannot be less than min nodes.';
    }
    return validateNumericInput(val);
  };

  render() {
    const {
      autoscalingEnabled,
      isMultiAz,
      autoScaleMinNodesValue,
      autoScaleMaxNodesValue,
    } = this.props;
    const { minErrorMessage, maxErrorMessage } = this.state;

    const minField = (
      <Field
        component={NodesInput}
        name="min_replicas"
        type="text"
        ariaLabel="Minimum nodes"
        validate={[this.validateMinNodes, required]}
        displayError={this.displayError}
        hideError={this.hideError}
        limit="min"
        min={autoScaleMinNodesValue}
      />
    );

    const maxField = (
      <Field
        component={NodesInput}
        name="max_replicas"
        type="text"
        ariaLabel="Maximum nodes"
        validate={[this.validateMaxNodes, required]}
        displayError={this.displayError}
        hideError={this.hideError}
        limit="max"
        max={autoScaleMaxNodesValue}
      />
    );

    const minError = minErrorMessage && (<div className="pf-c-form__helper-text pf-m-error">{minErrorMessage}</div>);
    const maxError = maxErrorMessage && (<div className="pf-c-form__helper-text pf-m-error">{maxErrorMessage}</div>);

    const multiAzFormGroups = (
      <>
        <Split hasGutter className="autoscaling__container">
          <SplitItem>
            <FormGroup
              label="Minimum nodes per zone"
              isRequired
              fieldId="nodes_min_multiAZ"
              className="autoscaling__nodes-formGroup"
              helperText={`x 3 zones = ${(parseInt(autoScaleMinNodesValue, 10) * 3)}`}
              // helperTextInvalid="Must be a number"
              // helperTextInvalidIcon={<ExclamationCircleIcon />}
            >
              {minField}
              <span>{`x 3 zones = ${(parseInt(autoScaleMinNodesValue, 10) * 3)}`}</span>
              {minError}
            </FormGroup>
          </SplitItem>
          <SplitItem>
            <FormGroup
              label="Maximum nodes per zone"
              isRequired
              fieldId="nodes_max_multiAZ"
              className="autoscaling__nodes-formGroup"
              helperText={`x 3 zones = ${(autoScaleMaxNodesValue * 3).toString()}`}
            >
              {maxField}
              {/* <span>{`X 3 zones = ${(autoScaleMaxNodesValue * 3).toString()}`}</span> */}
              {maxError}
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
              <span>minimum</span>
              {minError}
            </SplitItem>
            <SplitItem className="autoscaling__nodes-formGroup">
              {maxField}
              maximum
              {maxError}
            </SplitItem>
          </Split>
        </FormGroup>
      </>
    );

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
                    <ExternalLink href="https://docs.openshift.com/container-platform/latest/machine_management/applying-autoscaling.html">Learn more about autoscaling</ExternalLink>
                  </>
                )}
              />
            )}
          />
          <Field
            component={ReduxCheckbox}
            name="autoscalingEnabled"
            label="Enable autoscaling"
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
};

AutoScaleSection.defaultProps = {
  autoScaleMinNodesValue: '0',
  autoScaleMaxNodesValue: '0',
};

export default AutoScaleSection;
