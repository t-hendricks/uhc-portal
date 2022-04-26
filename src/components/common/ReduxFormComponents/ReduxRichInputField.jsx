import React from 'react';
import PropTypes from 'prop-types';
import {
  FormGroup,
  TextInput,
  InputGroup,
  Popover,
  HelperText,
  HelperTextItem,
  Button,
} from '@patternfly/react-core';

import { CheckCircleIcon, ExclamationCircleIcon, InfoCircleIcon } from '@patternfly/react-icons';
import './ReduxRichInputField.scss';
import PopoverHint from '../PopoverHint';

const ValidationItem = ({ itemText, isValid, touched }) => {
  let variant;
  let iconAlt = '';

  if (!itemText) { return null; }

  if (touched) {
    variant = isValid ? 'success' : 'error';
    iconAlt = isValid ? 'Satisfied: ' : 'Not met: ';
  }

  return (
    <HelperTextItem variant={variant} hasIcon isDynamic component="li" key={itemText}>
      <span className="pf-u-screen-reader">{iconAlt}</span>
      {itemText}
    </HelperTextItem>
  );
};

const ValidationIconButton = ({ isValid, touched, onClick }) => {
  let icon = <InfoCircleIcon className="redux-rich-input-field-icon_info" />;
  let label = 'Validation rules';
  let className = 'redux-rich-input-field-button_info';

  if (touched) {
    icon = isValid ? (<CheckCircleIcon className="redux-rich-input-field-icon_success" />) : (<ExclamationCircleIcon className="redux-rich-input-field-icon_danger" />);
    label = isValid ? 'All validation rules met' : 'Not all validation rules met';
    className = isValid ? 'redux-rich-input-field-button_valid' : 'redux-rich-input-field-button_not-valid';
  }
  return (
    <Button variant="control" aria-label={label} onClick={onClick} tabindex="-1" className={`${className} redux-rich-input-field-button`}>{icon}</Button>
  );
};

const ReduxRichInputField = (props) => {
  const {
    label,
    extendedHelpText,
    isRequired,
    input, // From redux-forms.
    disabled,
    formGroupClass,
    type,
    validation,
    helpTitle,
    helpExample,
    helpText,
    name,
    value,
    onChange,
  } = props;

  const [showPopover, setShowPopover] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const [touched, setTouched] = React.useState(false);

  // Use value pass from redux forms else use props
  const inputValue = input ? input.value : value;
  const inputName = input ? input.name : name;
  const inputOnChange = input ? input.onChange : onChange;

  React.useEffect(() => {
    if (inputValue.length > 0) {
      setTouched(true);
    }
  }, []);

  const isValid = !touched || !validation(inputValue).some(item => !item.validated);

  const textInputRef = React.createRef();

  let inputClassName = 'redux-rich-input-field_info';
  if (touched) {
    inputClassName = isValid ? 'redux-rich-input-field_valid' : 'redux-rich-input-field_not-valid';
  }

  return (
    <FormGroup
      fieldId={inputName}
      validated={isValid ? 'default' : 'error'}
      label={label}
      isRequired={isRequired}
      labelIcon={extendedHelpText && (<PopoverHint hint={extendedHelpText} />)}
      className={`${formGroupClass || ''}`}
      helperText={helpText}
      helperTextInvalid={helpText}

    >
      <Popover
        aria-label={helpTitle}
        headerContent={helpTitle}
        isVisible={showPopover}
        position="top-end"
        shouldClose={() => {
          if (isFocused) { setIsFocused(false); } else { setShowPopover(false); }
        }}
        bodyContent={(
          <>
            <HelperText component="ul" id={`redux-rich-input-popover-${inputName}`}>
              {validation(inputValue).map(item => (
                <ValidationItem itemText={item.text} isValid={item.validated} touched={touched} />
              ))}
            </HelperText>
          </>
      )}
        footerContent={helpExample}
      >

        <InputGroup>
          <TextInput
            value={inputValue}
            isRequired={isRequired}
            id={inputName}
            name={inputName}
            validated={isValid ? 'default' : 'error'}
            isDisabled={disabled}
            type={type}
            autocomplete="off"
            aria-invalid={!isValid}
            onBlur={() => { setIsFocused(false); setShowPopover(false); }}
            onClick={() => { setIsFocused(true); setShowPopover(true); }}
            onFocus={() => { setIsFocused(true); setShowPopover(true); setTouched(true); }}
            onChange={inputOnChange}
            ref={textInputRef}
            aria-describedby={`redux-rich-input-popover-${inputName}`}
            className={`${inputClassName} redux-rich-input-field`}
          />
          <ValidationIconButton
            isValid={isValid}
            touched={touched}
            onClick={(e) => {
              e.stopPropagation();
              setShowPopover(true);
              textInputRef.current.focus();
            }}
          />

        </InputGroup>
      </Popover>
    </FormGroup>
  );
};

ValidationIconButton.propTypes = {
  isValid: PropTypes.bool,
  touched: PropTypes.bool,
  onClick: PropTypes.func,
};

ValidationItem.propTypes = {
  itemText: PropTypes.string,
  isValid: PropTypes.bool,
  touched: PropTypes.bool,
};

ReduxRichInputField.defaultProps = {
  type: 'text',
  validation: () => ([]),
  helpText: '',
  helpTitle: '',
  helpExample: '',
  value: '',
  onChange: () => {},
};

ReduxRichInputField.propTypes = {
  label: PropTypes.string,
  helpText: PropTypes.string,
  extendedHelpText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  disabled: PropTypes.bool,
  isRequired: PropTypes.bool,
  formGroupClass: PropTypes.string,
  type: PropTypes.string,
  validation: PropTypes.func,
  helpTitle: PropTypes.string,
  helpExample: PropTypes.node,

  // Use only if redux forms is not being used
  value: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,

  // props passed by redux-form
  input: PropTypes.object.isRequired,
};

export default ReduxRichInputField;
