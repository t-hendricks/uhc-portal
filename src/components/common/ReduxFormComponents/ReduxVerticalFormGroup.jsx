
import React from 'react';
import PropTypes from 'prop-types';
import {
  FormGroup,
  TextInput,
  TextArea,
} from '@patternfly/react-core';
import PopoverHint from '../PopoverHint';

// To be used inside redux-form Field component.
function ReduxVerticalFormGroup(props) {
  const {
    label,
    helpText,
    extendedHelpText,
    isRequired,
    meta: { error, touched },
    input,
    disabled,
    isTextArea,
    ...extraProps // any extra props not specified above
  } = props;

  const InputComponent = isTextArea ? TextArea : TextInput;
  // TextArea and TextInput has different ways to specify if the component is disabled
  // this forces us to do this trick:
  const disabledPropName = isTextArea ? 'disabled' : 'isDisabled';
  const disabledProp = {
    [disabledPropName]: disabled,
  };

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
      <InputComponent
        value={input.value}
        isRequired={isRequired}
        id={input.name}
        name={input.name}
        isValid={!(touched && error)}
        {...disabledProp}
        {...input}
        {...extraProps}
      />
    </FormGroup>
  );
}
ReduxVerticalFormGroup.defaultProps = {
  helpText: '',
  isRequired: false,
};
ReduxVerticalFormGroup.propTypes = {
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
  // Render a textarea instead of a textinput?
  isTextArea: PropTypes.bool,
  // plus other props passed from the <Field> component to the control (extraProps,
  // incl. children)...
};

export default ReduxVerticalFormGroup;
