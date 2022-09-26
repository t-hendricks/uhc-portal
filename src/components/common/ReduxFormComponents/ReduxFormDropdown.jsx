import React from 'react';
import PropTypes from 'prop-types';

import { FormGroup, FormSelect, FormSelectOption } from '@patternfly/react-core';
import PopoverHint from '../PopoverHint';

class DropDownSelect extends React.Component {
  state = {
    value: '',
  };

  onChange = (value, event) => {
    const {
      input: { onChange },
    } = this.props;
    this.setState({ value });
    onChange(event, value); // redux form has the parameters the other way around from PF
  };

  render() {
    const {
      options,
      label,
      helpText,
      meta: { error, touched },
      input,
      disabled,
      isFormGroup,
      isRequired,
      extendedHelpText,
      ...extraProps
    } = this.props;
    const { value } = this.state;

    const formSelect = (
      <FormSelect
        id={input.name}
        name={input.name}
        value={value}
        {...input}
        onChange={this.onChange}
        isDisabled={disabled}
        {...extraProps}
      >
        {options.map((option) => (
          <FormSelectOption key={option.value} value={option.value} label={option.name} />
        ))}
      </FormSelect>
    );

    return isFormGroup ? (
      <FormGroup
        fieldId={input.name}
        label={label}
        validated={touched && error ? 'error' : null}
        isRequired={isRequired}
        labelIcon={extendedHelpText && <PopoverHint hint={extendedHelpText} />}
        helperText={helpText}
        helperTextInvalid={touched && error ? `${helpText} ${error}` : ''}
      >
        {formSelect}
      </FormGroup>
    ) : (
      formSelect
    );
  }
}

DropDownSelect.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
  input: PropTypes.shape({
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  label: PropTypes.string,
  helpText: PropTypes.string,
  meta: PropTypes.shape({
    error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    touched: PropTypes.bool,
  }).isRequired,
  disabled: PropTypes.bool,
  isFormGroup: PropTypes.bool,
  isRequired: PropTypes.bool,
  extendedHelpText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

DropDownSelect.defaultProps = {
  isFormGroup: true,
};

export default DropDownSelect;
