import React from 'react';
import PropTypes from 'prop-types';
import {
  FormGroup,
  TextInput,
  TextArea,
  InputGroup,
  InputGroupText,
  Button,
  Menu,
  MenuContent,
  MenuList,
  MenuItem,
  MenuItemAction,
  Popper,
} from '@patternfly/react-core';
import { EyeIcon, EyeSlashIcon, RedoIcon } from '@patternfly/react-icons';
import PopoverHint from '../PopoverHint';

// To be used inside redux-form Field component.
const ReduxVerticalFormGroup = ({
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
  onAutocomplete,
  getAutocompleteValue,
  getAutocompleteText = (value) => value,
  ...extraProps // any extra props not specified above
}) => {
  const [inputValueHidden, setInputValueHidden] = React.useState(true);
  const [isAutocompleteOpen, setIsAutocompleteOpen] = React.useState(false);
  const [autocompleteValue, setAutocompleteValue] = React.useState(
    getAutocompleteValue ? getAutocompleteValue() : undefined,
  );
  const InputComponent = isTextArea ? TextArea : TextInput;
  // TextArea and TextInput has different ways to specify if the component is disabled
  // this forces us to do this trick:
  const disabledPropName = isTextArea ? 'disabled' : 'isDisabled';
  const disabledProp = {
    [disabledPropName]: disabled,
  };
  const isPassword = extraProps.type === 'password';
  const redoId = `${extraProps.id || ''}-redo`;

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

  let { onFocus } = input;
  let { onBlur } = input;
  let autocomplete;
  if (getAutocompleteValue) {
    const onSelect = (event) => {
      event.stopPropagation();
      input.onChange(autocompleteValue);
      if (onAutocomplete) {
        onAutocomplete(autocompleteValue, input.name);
      }
      setIsAutocompleteOpen(false);
    };

    onFocus = (...args) => {
      setIsAutocompleteOpen(true);
      if (input.onFocus) {
        input.onFocus(...args);
      }
    };

    onBlur = (...args) => {
      if (
        args[0].relatedTarget.attributes?.role?.nodeValue !== 'menuitem' &&
        args[0].relatedTarget.id !== redoId
      ) {
        setIsAutocompleteOpen(false);
      }
      if (input.onBlur) {
        input.onBlur(...args);
      }
    };

    const regenerateAutocomplete = () => {
      if (getAutocompleteValue) {
        setAutocompleteValue(getAutocompleteValue());
      }
    };

    autocomplete = (
      <Menu onSelect={onSelect}>
        <MenuContent>
          <MenuList>
            <MenuItem
              itemId={0}
              actions={
                <MenuItemAction
                  icon={<RedoIcon aria-hidden />}
                  onClick={regenerateAutocomplete}
                  actionId="redo"
                  id={redoId}
                />
              }
            >
              {getAutocompleteText(autocompleteValue)}
            </MenuItem>
          </MenuList>
        </MenuContent>
      </Menu>
    );
  }

  const inputGroup = (
    <InputGroup className={isValid && 'valid-field'}>
      {inputPrefix ? <InputGroupText>{inputPrefix}</InputGroupText> : null}
      <InputComponent
        id={input.name}
        // ref={inputRef}
        isRequired={isRequired}
        validated={isValid ? 'default' : 'error'}
        {...disabledProp}
        {...input}
        {...extraProps}
        type={isPassword && !inputValueHidden ? 'text' : extraProps.type}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      {isPassword && (
        <Button
          aria-label={inputValueHidden ? 'show-password' : 'hide-password'}
          variant="control"
          onClick={() => setInputValueHidden((prev) => !prev)}
        >
          {inputValueHidden ? <EyeSlashIcon /> : <EyeIcon />}
        </Button>
      )}
    </InputGroup>
  );

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
      {getAutocompleteValue && (
        <Popper
          trigger={inputGroup}
          popper={autocomplete}
          isVisible={isAutocompleteOpen}
          enableFlip={false}
        />
      )}
      {!getAutocompleteValue && inputGroup}
    </FormGroup>
  );
};

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
  onAutocomplete: PropTypes.func,
  getAutocompleteValue: PropTypes.func,
  getAutocompleteText: PropTypes.func,
};

export default ReduxVerticalFormGroup;
