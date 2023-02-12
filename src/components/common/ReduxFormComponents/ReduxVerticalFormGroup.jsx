import React from 'react';
import PropTypes from 'prop-types';
import {
  FormGroup,
  TextInput,
  TextArea,
  InputGroup,
  InputGroupText,
  Button,
} from '@patternfly/react-core';
import { EyeIcon, EyeSlashIcon } from '@patternfly/react-icons';
import PopoverHint from '../PopoverHint';

// To be used inside redux-form Field component.
class ReduxVerticalFormGroup extends React.Component {
  state = {
    inputValueHidden: true,
  };

  render() {
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
      formGroupClass,
      hasOtherValidation = false,
      ...extraProps // any extra props not specified above
    } = this.props;

    const { inputValueHidden } = this.state;
    const InputComponent = isTextArea ? TextArea : TextInput;
    // TextArea and TextInput has different ways to specify if the component is disabled
    // this forces us to do this trick:
    const disabledPropName = isTextArea ? 'disabled' : 'isDisabled';
    const disabledProp = {
      [disabledPropName]: disabled,
    };
    const isPassword = extraProps.type === 'password';

    const helperTextInvalid = () => {
      if (touched && error && typeof error === 'string') {
        if (showHelpTextOnError) {
          return `${helpText} ${error}`;
        }
        return error;
      }
      return isPassword ? helpText : '';
    };

    const isValid = hasOtherValidation || !touched || !error;

    return (
      <FormGroup
        fieldId={input.name}
        validated={isValid ? 'default' : 'error'}
        label={label}
        helperText={helpText}
        helperTextInvalid={helperTextInvalid()}
        isRequired={isRequired}
        labelIcon={extendedHelpText && <PopoverHint hint={extendedHelpText} />}
        className={formGroupClass}
      >
        <InputGroup className={isValid && 'valid-field'}>
          {inputPrefix ? <InputGroupText>{inputPrefix}</InputGroupText> : null}
          <InputComponent
            id={input.name}
            isRequired={isRequired}
            validated={isValid ? 'default' : 'error'}
            {...disabledProp}
            {...input}
            {...extraProps}
            type={isPassword && !inputValueHidden ? 'text' : extraProps.type}
          />
          {isPassword && (
            <Button
              aria-label={inputValueHidden ? 'show-password' : 'hide-password'}
              variant="control"
              onClick={() =>
                this.setState((prevState) => ({ inputValueHidden: !prevState.inputValueHidden }))
              }
            >
              {inputValueHidden ? <EyeSlashIcon /> : <EyeIcon />}
            </Button>
          )}
        </InputGroup>
      </FormGroup>
    );
  }
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
  extendedHelpText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
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
  hasOtherValidation: PropTypes.bool,
  // plus other props passed from the <Field> component to the control (extraProps,
  // incl. children)...
  showHelpTextOnError: PropTypes.bool,
  inputPrefix: PropTypes.string,
  formGroupClass: PropTypes.string,
};

export default ReduxVerticalFormGroup;
