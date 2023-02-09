import React, { createRef, useState, useEffect, useReducer } from 'react';
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
import {
  SpinnerIcon,
  InfoCircleIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@patternfly/react-icons';

import PopoverHint from '../PopoverHint';

import './ReduxRichInputField.scss';

const ValidationItem = ({ text, touched, isValid, isValidating, isInitialized }) => {
  if (!text) {
    return null;
  }

  let variant;
  let iconAlt = '';
  if (touched) {
    if (!isInitialized || isValidating) {
      variant = 'indeterminate';
      iconAlt = 'Pending: ';
    } else {
      variant = isValid ? 'success' : 'error';
      iconAlt = isValid ? 'Satisfied: ' : 'Not met: ';
    }
  }

  return (
    <HelperTextItem variant={variant} hasIcon isDynamic component="li" key={text}>
      <span className="pf-u-screen-reader">{iconAlt}</span>
      {text}
    </HelperTextItem>
  );
};

const ValidationIconButton = ({ touched, isValid, hasFailures, isValidating, onClick }) => {
  let icon = <InfoCircleIcon className="redux-rich-input-field-icon_info" />;
  let label = 'Validation rules';
  let className = 'redux-rich-input-field-button_info';

  if (touched) {
    if (isValidating) {
      icon = <SpinnerIcon className="redux-rich-input-field-icon_info" />;
      label = 'Validation in progress';
    } else if (isValid) {
      icon = <CheckCircleIcon className="redux-rich-input-field-icon_success" />;
      label = 'All validation rules met';
      className = 'redux-rich-input-field-button_valid';
    } else if (hasFailures) {
      icon = <ExclamationCircleIcon className="redux-rich-input-field-icon_danger" />;
      label = 'Not all validation rules met';
      className = 'redux-rich-input-field-button_not-valid';
    }
  }

  return (
    <Button
      variant="control"
      aria-label={label}
      tabindex="-1"
      className={`${className} redux-rich-input-field-button`}
      onClick={onClick}
    >
      {icon}
    </Button>
  );
};

const validationInitialState = {
  syncValidation: [],
  asyncValidation: [],
};

const validationReducer = (state, action) => {
  switch (action.type) {
    case 'set-sync-validation':
      return {
        ...state,
        syncValidation: action.payload,
      };

    case 'set-async-validation':
      return {
        ...state,
        asyncValidation: action.payload,
      };

    case 'set-async-validating':
      return {
        ...state,
        asyncValidation: state.asyncValidation.map((item) => ({
          ...item,
          validating: !!action.value,
        })),
      };

    default:
      throw new Error();
  }
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
    asyncValidation,
    helpTitle,
    helpExample,
    helpText,
    name,
    value,
    onChange,
    meta: { error, asyncValidating },
  } = props;
  // Use value pass from redux forms else use props
  const inputValue = input ? input.value : value;
  const inputName = input ? input.name : name;
  const inputOnChange = input ? input.onChange : onChange;

  const textInputRef = createRef();

  const [touched, setTouched] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showPopover, setShowPopover] = useState(false);

  const [validationState, validationDispatch] = useReducer(
    validationReducer,
    validationInitialState,
  );

  const evaluatedValidation = [].concat(
    validationState.syncValidation,
    validationState.asyncValidation,
  );

  // field-level validity is affected both by failures (`false`) and incomplete items (`undefined`)
  const isValid = !touched || evaluatedValidation.every((item) => !!item.validated);
  const isValidating = touched && validationState.asyncValidation.some((item) => item.validating);
  // required to distinguish a non-valid status due to failures, from one due to incomplete evaluation
  const hasFailures = touched && evaluatedValidation.some((item) => item.validated === false);

  let inputClassName = 'redux-rich-input-field_info';
  if (touched && !isValidating) {
    if (isValid) {
      inputClassName = 'redux-rich-input-field_valid';
    } else if (hasFailures) {
      inputClassName = 'redux-rich-input-field_not-valid';
    }
  }

  const setAsyncValidating = (isAsyncValidating) => {
    validationDispatch({
      type: 'set-async-validating',
      value: isAsyncValidating,
    });
  };

  const populateValidation = (term) => {
    const populatedValidation = validation(term);
    validationDispatch({
      type: 'set-sync-validation',
      payload: populatedValidation,
    });
    return populatedValidation;
  };

  const populateAsyncValidation = (term) => {
    const populatedValidation = asyncValidation(term);
    validationDispatch({
      type: 'set-async-validation',
      payload: populatedValidation,
    });
    return populatedValidation;
  };

  const evaluateAsyncValidation = (formError) => {
    validationDispatch({
      type: 'set-async-validation',
      payload: validationState.asyncValidation.map((v) => ({
        ...v,
        validated: v.text !== formError,
      })),
    });
  };

  useEffect(() => {
    // `false` means the form async-validation has ended (as opposed to `undefined`)
    if (asyncValidating === false && inputValue) {
      evaluateAsyncValidation(error);
    }
  }, [error, asyncValidating]);

  useEffect(() => {
    setAsyncValidating(!!asyncValidating);
  }, [asyncValidating]);

  useEffect(() => {
    if (inputValue?.length) {
      setTouched(true);
    }
  }, []);

  useEffect(() => {
    if (hasFailures) {
      setShowPopover(true);
    }
  }, [hasFailures]);

  useEffect(() => {
    populateValidation(inputValue);
    populateAsyncValidation(inputValue);
  }, [inputValue]);

  useEffect(() => {
    // trigger form-level async-validation
    input.onBlur(inputValue);
  }, []);

  return (
    <FormGroup
      fieldId={inputName}
      validated={isValid ? 'default' : 'error'}
      label={label}
      isRequired={isRequired}
      labelIcon={extendedHelpText && <PopoverHint hint={extendedHelpText} />}
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
          if (isFocused) {
            setIsFocused(false);
          } else {
            setShowPopover(false);
          }
        }}
        bodyContent={
          <>
            <HelperText component="ul" id={`redux-rich-input-popover-${inputName}`}>
              {evaluatedValidation.map((item) => (
                <ValidationItem
                  touched={touched}
                  text={item.text}
                  isValid={item.validated}
                  isValidating={item.validating}
                  isInitialized={typeof item.validated !== 'undefined'}
                />
              ))}
            </HelperText>
          </>
        }
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
            onBlur={(e) => {
              setIsFocused(false);
              setShowPopover(false);
              input.onBlur(e);
              setTouched(true);
            }}
            onClick={() => {
              setIsFocused(true);
              setShowPopover(true);
            }}
            onFocus={() => {
              setIsFocused(true);
              setShowPopover(true);
            }}
            onChange={(val) => {
              inputOnChange(val);
              if (!touched && val?.length) {
                setTouched(true);
              }
            }}
            ref={textInputRef}
            aria-describedby={`redux-rich-input-popover-${inputName}`}
            className={`${inputClassName} redux-rich-input-field`}
          />
          <ValidationIconButton
            touched={touched}
            isValid={isValid}
            hasFailures={hasFailures}
            isValidating={isValidating}
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
  touched: PropTypes.bool,
  isValid: PropTypes.bool,
  hasFailures: PropTypes.bool,
  isValidating: PropTypes.bool,
  onClick: PropTypes.func,
};

ValidationItem.propTypes = {
  text: PropTypes.string,
  touched: PropTypes.bool,
  isValid: PropTypes.bool,
  isValidating: PropTypes.bool,
  isInitialized: PropTypes.bool,
};

ReduxRichInputField.defaultProps = {
  type: 'text',
  validation: () => [],
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
  asyncValidation: PropTypes.func,
  helpTitle: PropTypes.string,
  helpExample: PropTypes.node,

  // Use only if redux forms is not being used
  value: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,

  // props passed by redux-form
  input: PropTypes.object.isRequired,
  meta: PropTypes.shape({
    error: PropTypes.string,
    asyncValidating: PropTypes.bool,
  }),
};

export default ReduxRichInputField;
