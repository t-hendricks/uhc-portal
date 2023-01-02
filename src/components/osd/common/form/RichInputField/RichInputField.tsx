import React, { createRef, useState, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';

import { FormGroup, TextInput, InputGroup, Popover, HelperText } from '@patternfly/react-core';

import { evaluateClusterNameAsyncValidation } from '~/common/validators';
import PopoverHint from '~/components/common/PopoverHint';
import { ValidationItem } from '../../ValidationItem';
import { ValidationIconButton } from '../../ValidationIconButton';

import './RichInputField.scss';

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

export const RichInputField = (props) => {
  const {
    label,
    extendedHelpText,
    isRequired,
    input,
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
  } = props;
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
  const isValid = !touched || !evaluatedValidation.some((item) => item.validated === false);
  const isValidating = touched && validationState.asyncValidation.some((item) => item.validating);

  let inputClassName = 'rich-input-field_info';
  if (touched && !isValidating) {
    inputClassName = isValid ? 'rich-input-field_valid' : 'rich-input-field_not-valid';
  }

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

  const evaluateAsyncValidation = async (term) => {
    validationDispatch({ type: 'set-async-validating', value: true });
    const evaluatedAsyncValidation = await evaluateClusterNameAsyncValidation(term);
    validationDispatch({ type: 'set-async-validation', payload: evaluatedAsyncValidation });
    validationDispatch({ type: 'set-async-validating', value: false });
  };

  const triggerAsyncValidation = async (blurEvent) => {
    // triggers the form async validation (to prevent "next" navigation if field is invalid)
    input.onBlur(blurEvent);
    // recalculates the component data for rendering
    await evaluateAsyncValidation(blurEvent?.target.value ?? inputValue);
  };

  useEffect(() => {
    if (inputValue?.length) {
      setTouched(true);
    }
  }, []);

  useEffect(() => {
    if (!isValid) {
      setShowPopover(true);
    }
  }, [isValid]);

  useEffect(() => {
    populateValidation(inputValue);
    populateAsyncValidation(inputValue);
  }, [inputValue]);

  useEffect(() => {
    triggerAsyncValidation();
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
            <HelperText component="ul" id={`rich-input-popover-${inputName}`}>
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
            onBlur={async (e) => {
              setIsFocused(false);
              setShowPopover(false);
              await triggerAsyncValidation(e);
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
            aria-describedby={`rich-input-popover-${inputName}`}
            className={`${inputClassName} rich-input-field`}
          />
          <ValidationIconButton
            touched={touched}
            isValid={isValid}
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

RichInputField.defaultProps = {
  type: 'text',
  validation: () => [],
  helpText: '',
  helpTitle: '',
  helpExample: '',
  value: '',
  onChange: () => {},
};

RichInputField.propTypes = {
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
  value: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  input: PropTypes.object.isRequired,
};
