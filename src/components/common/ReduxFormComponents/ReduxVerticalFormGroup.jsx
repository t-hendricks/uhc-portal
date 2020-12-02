
import React from 'react';
import PropTypes from 'prop-types';
import {
  FormGroup,
  TextInput,
  TextArea,
  InputGroup,
  InputGroupText,
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
    showHelpTextOnError,
    inputPrefix,
    ...extraProps // any extra props not specified above
  } = props;

  const InputComponent = isTextArea ? TextArea : TextInput;
  // TextArea and TextInput has different ways to specify if the component is disabled
  // this forces us to do this trick:
  const disabledPropName = isTextArea ? 'disabled' : 'isDisabled';
  const disabledProp = {
    [disabledPropName]: disabled,
  };

  const helperTextInvalid = () => {
    if (touched && error) {
      if (showHelpTextOnError) {
        return `${helpText} ${error}`;
      }
      return error;
    }
    return '';
  };

  const isValid = !(touched && error);

  return (
    <FormGroup
      fieldId={input.name}
      validated={isValid ? 'default' : 'error'}
      label={label}
      helperText={helpText}
      helperTextInvalid={helperTextInvalid()}
      isRequired={isRequired}
      labelIcon={extendedHelpText && (<PopoverHint hint={extendedHelpText} />)}
    >
      <InputGroup className={isValid && 'valid-field'}>
        {
          inputPrefix
            ? (
              <InputGroupText>
                {inputPrefix}
              </InputGroupText>
            ) : null
        }
        <InputComponent
          value={input.value}
          isRequired={isRequired}
          id={input.name}
          name={input.name}
          validated={isValid ? 'default' : 'error'}
          {...disabledProp}
          {...input}
          {...extraProps}
        />
      </InputGroup>
    </FormGroup>
  );
}
ReduxVerticalFormGroup.defaultProps = {
  helpText: '',
  isRequired: false,
  showHelpTextOnError: true,
  inputPrefix: '',
};
ReduxVerticalFormGroup.propTypes = {
  label: PropTypes.string,
  helpText: PropTypes.string,
  extendedHelpText: PropTypes.string,
  disabled: PropTypes.bool,
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
  showHelpTextOnError: PropTypes.bool,
  inputPrefix: PropTypes.string,
};

export default ReduxVerticalFormGroup;
