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
  getAutocompleteValue,
  getAutocompleteText = (value) => value,
  ...extraProps // any extra props not specified above
}) => {
  const [inputValueHidden, setInputValueHidden] = React.useState(true);
  const [isAutocompleteOpen, setIsAutocompleteOpen] = React.useState(false);
  const [autocompleteValue, setAutocompleteValue] = React.useState(
    getAutocompleteValue ? getAutocompleteValue() : undefined,
  );
  // const inputRef = React.useRef(null);

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

  let onFocus = input.onFocus;
  let onBlur = input.onBlur;
  let autocomplete;
  if (getAutocompleteValue) {
    const onSelect = (event) => {
      event.stopPropagation();
      input.onChange(autocompleteValue);
      // inputRef.current.value=autocompleteValue;
      setIsAutocompleteOpen(false);
    };

    onFocus = (...args) => {
      setIsAutocompleteOpen(true);
      if (input.onFocus) {
        input.onFocus(...args);
      }
    };

    onBlur = (...args) => {
      if (args[0].relatedTarget.role !== 'menuitem' && args[0].relatedTarget.id !== redoId) {
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

export default ReduxVerticalFormGroup;
