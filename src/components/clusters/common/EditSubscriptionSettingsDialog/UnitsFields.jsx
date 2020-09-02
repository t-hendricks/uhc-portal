import React from 'react';
import PropTypes from 'prop-types';
import { Radio, TextInput, FormGroup } from '@patternfly/react-core';

import {
  subscriptionSettings,
  subscriptionSystemUnits,
} from '../../../../common/subscriptionTypes';

// To be used either inside redux-form Field component, or directly as markup.
class UnitFields extends React.Component {
    state={
      computeCoresValue: '',
      socketsValue: '',
      computeCoresTouched: false,
      socketsTouched: false,
    }

    componentDidMount() {
      const { subscription } = this.props;
      this.setState({
        computeCoresValue: subscription.cpu_total || '0',
        socketsValue: subscription.socket_total || '0',
      });
    }

    changeHandler = (value, event) => {
      const { input, onChangeCallback } = this.props;
      const newValue = event.target.value;

      input.onChange(newValue, event);
      onChangeCallback(input.name, newValue);
    };

    changeNumericInputHandler = (value, event, unitsValue) => {
      const { onChangeNumericInputCallback } = this.props;
      const newValue = event.target.value;
      let unitsFieldName = null;
      if (unitsValue === subscriptionSystemUnits.CORES_VCPU) {
        unitsFieldName = 'cpu_total';
        this.setState({ computeCoresValue: newValue, computeCoresTouched: true });
      }

      if (unitsValue === subscriptionSystemUnits.SOCKETS) {
        unitsFieldName = 'socket_total';
        this.setState({ socketsValue: newValue, socketsTouched: true });
      }

      onChangeNumericInputCallback(unitsFieldName, newValue);
    };

    validate = (units) => {
      const { input } = this.props;
      const {
        computeCoresTouched,
        computeCoresValue,
        socketsTouched,
        socketsValue,
      } = this.state;

      const value = units === subscriptionSystemUnits.CORES_VCPU
        ? computeCoresValue : socketsValue;
      const touched = units === subscriptionSystemUnits.CORES_VCPU
        ? computeCoresTouched : socketsTouched;

      const numericVal = parseInt(value, 10);

      if (!(touched && input.value === units)
      || (Number.isInteger(numericVal) && numericVal > 0)
      ) {
        return 'default';
      }
      return 'error';
    };


    render() {
      const {
        className,
        input,
        isDisabled,
        subscription,
      } = this.props;

      const { computeCoresValue, socketsValue } = this.state;
      const { SYSTEM_UNITS } = subscriptionSettings;
      const { CORES_VCPU, SOCKETS } = subscriptionSystemUnits;

      // changing units is disabled for connected cluster
      const isUnitsNumDisabled = !!subscription.id && subscription.status !== 'Disconnected';

      return (
        <>
          <Radio
            className={className}
            isChecked={input.value === CORES_VCPU}
            key={`${SYSTEM_UNITS}-${CORES_VCPU}`}
            value={CORES_VCPU}
            name={SYSTEM_UNITS}
            id={`${SYSTEM_UNITS}-${CORES_VCPU}`}
            aria-label={CORES_VCPU}
            label={CORES_VCPU}
            onChange={this.changeHandler}
            isDisabled={isDisabled}
          />
          {input.value === CORES_VCPU
          && (
          <FormGroup
            id="compute-cores-input"
            className="units-numeric-input"
            label="Number of compute cores"
            isRequired={input.value === CORES_VCPU}
            helperText="This number should not include master nodes"
            helperTextInvalid="Compute cores must be a number."
            validated={this.validate(CORES_VCPU)}
          >
            <TextInput
              value={computeCoresValue}
              isRequired={input.value === CORES_VCPU}
              name="compute_cores"
              isDisabled={
                input.value !== CORES_VCPU
                 || isDisabled
                 || isUnitsNumDisabled
              }
              type="text"
              onChange={(value, event) => this.changeNumericInputHandler(value, event, CORES_VCPU)}
              aria-label="compute cores"
            />
          </FormGroup>
          )}
          <Radio
            className={className}
            isChecked={input.value === SOCKETS}
            key={`${SYSTEM_UNITS}-${SOCKETS}`}
            value={SOCKETS}
            name={SYSTEM_UNITS}
            id={`${SYSTEM_UNITS}-${SOCKETS}`}
            aria-label={SOCKETS}
            label={SOCKETS}
            onChange={this.changeHandler}
            isDisabled={isDisabled}
          />
          {input.value === SOCKETS
          && (
          <FormGroup
            className="units-numeric-input"
            label="Number of sockets"
            isRequired={input.value === SOCKETS}
            helperTextInvalid="Sockets must be a number."
            validated={this.validate(SOCKETS)}
          >
            <TextInput
              value={socketsValue}
              isRequired={input.value === SOCKETS}
              id="compute-cores-input"
              name="compute_cores"
              isDisabled={
                input.value !== SOCKETS
                || isDisabled
                || isUnitsNumDisabled
              }
              type="text"
              onChange={(value, event) => this.changeNumericInputHandler(value, event, SOCKETS)}
              aria-label="compute cores"
            />
          </FormGroup>
          )}
        </>
      );
    }
}

UnitFields.propTypes = {
  isDisabled: PropTypes.bool,
  subscription: PropTypes.object,
  onChangeCallback: PropTypes.func.isRequired,
  onChangeNumericInputCallback: PropTypes.func.isRequired,
  input: PropTypes.shape({
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
  }).isRequired,
  className: PropTypes.string,
};

UnitFields.defaultProps = {
  subscription: {},
};


export default UnitFields;
