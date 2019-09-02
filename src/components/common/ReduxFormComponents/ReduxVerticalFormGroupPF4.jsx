
import React from 'react';
import PropTypes from 'prop-types';
import {
  FormGroup,
  TextInput,
} from '@patternfly/react-core';
import PopoverHint from '../PopoverHint';

// To be used inside redux-form Field component.
function ReduxVerticalFormGroupPF4(props) {
  const {
    label,
    helpText,
    extendedHelpText,
    isRequired,
    meta: { error, touched },
    input,
    disabled,
    ...extraProps // any extra props not specified above
  } = props;

  return (
    <FormGroup
      fieldId={input.name}
      isValid={!(touched && error)}
      label={label}
      helperText={helpText}
      helperTextInvalid={touched && error ? `${helpText} ${error}` : ''}
      isRequired={isRequired}
    >
      { extendedHelpText && (
        <PopoverHint hint={extendedHelpText} />
      )}
      <TextInput
        value={input.value}
        isRequired={isRequired}
        type="text"
        id={input.name}
        name={input.name}
        isValid={!(touched && error)}
        isDisabled={disabled}
        {...input}
        {...extraProps}
      />
    </FormGroup>
  );
}
ReduxVerticalFormGroupPF4.defaultProps = {
  helpText: '',
  isRequired: false,
};
ReduxVerticalFormGroupPF4.propTypes = {
  label: PropTypes.string.isRequired,
  helpText: PropTypes.string,
  extendedHelpText: PropTypes.string,
  // props passed by redux-form
  // collection of redux-form callbacks to be destructured into an html input element
  input: PropTypes.object.isRequired,
  // redux-form metadata like error or active states
  meta: PropTypes.object.isRequired,
  // is this a required field?
  isRequired: PropTypes.bool,
  // plus other props passed from the <Field> component to the control (extraProps,
  // incl. children)...
};

export default ReduxVerticalFormGroupPF4;
