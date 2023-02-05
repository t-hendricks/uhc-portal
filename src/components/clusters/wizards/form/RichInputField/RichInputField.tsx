import React, { createRef, useState, useEffect, useReducer } from 'react';
import { FormikErrors } from 'formik';
import { WrappedFieldInputProps } from 'redux-form';
import { FormGroup, TextInput, InputGroup, Popover, HelperText } from '@patternfly/react-core';

import { useFormState } from '~/components/clusters/wizards/hooks';
import PopoverHint from '~/components/common/PopoverHint';
import { ValidationItem, ValidationIconButton } from '~/components/clusters/wizards/common';

import './RichInputField.scss';

type State = {
  syncValidation: {
    text: string;
    validated: boolean;
    validating?: boolean;
  }[];
  asyncValidation: {
    text: string;
    validated?: boolean;
    validating?: boolean;
  }[];
};

const validationInitialState: State = {
  syncValidation: [],
  asyncValidation: [],
};

type Action =
  | {
      type: 'set-sync-validation';
      payload: {
        validated: boolean;
        text: string;
      }[];
    }
  | {
      type: 'set-async-validation';
      payload: {
        validating?: boolean;
        validated?: boolean;
        text: string;
      }[];
    }
  | {
      type: 'set-async-validating';
      value: boolean;
    };

const validationReducer = (state = validationInitialState, action: Action): State => {
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

type Props = {
  label?: string;
  helpText?: string;
  extendedHelpText?: React.ReactNode;
  disabled?: boolean;
  isRequired?: boolean;
  formGroupClass?: string;
  type?: React.ComponentProps<typeof TextInput>['type'];
  validation?: (value: string) => {
    text: string;
    validated: boolean;
  }[];
  asyncValidation?: (value: string) => {
    text: string;
    validator: () => Promise<boolean>;
  }[];
  helpTitle?: string;
  helpExample?: React.ReactNode;
  value?: string;
  name?: string;
  onChange?: (value: string) => void;
  input?: WrappedFieldInputProps;
};

export const RichInputField = ({
  label,
  extendedHelpText,
  isRequired,
  input,
  disabled,
  formGroupClass,
  type = 'text',
  validation = () => [],
  asyncValidation = () => [],
  helpTitle,
  helpExample = '',
  helpText = '',
  name,
  value = '',
  onChange = () => {},
}: Props) => {
  const inputValue = input ? input.value : value;
  const inputName = String(input ? input.name : name);
  const inputOnChange = input ? input.onChange : onChange;

  const textInputRef = createRef<HTMLInputElement>();

  const {
    validateField,
    isValidating: isFormValidating,
    errors: { [inputName]: error },
  } = useFormState();

  const [touched, setTouched] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showPopover, setShowPopover] = useState(false);

  const [validationState, validationDispatch] = useReducer(
    validationReducer,
    validationInitialState,
  );

  const evaluatedValidation = [
    ...validationState.syncValidation,
    ...validationState.asyncValidation,
  ];

  // field-level validity is affected both by failures (`false`) and incomplete items (`undefined`)
  const isValid = !touched || evaluatedValidation.every((item) => !!item.validated);
  const isValidating = touched && validationState.asyncValidation.some((item) => item.validating);
  // required to distinguish a non-valid status due to failures, from one due to incomplete evaluation
  const hasFailures = touched && evaluatedValidation.some((item) => item.validated === false);

  let inputClassName = 'rich-input-field_info';
  if (touched && !isValidating) {
    if (isValid) {
      inputClassName = 'rich-input-field_valid';
    } else if (hasFailures) {
      inputClassName = 'rich-input-field_not-valid';
    }
  }

  const setAsyncValidating = (isAsyncValidating: boolean) => {
    validationDispatch({
      type: 'set-async-validating',
      value: isAsyncValidating,
    });
  };

  const populateValidation = (term: string) => {
    const populatedValidation = validation(term);
    validationDispatch({
      type: 'set-sync-validation',
      payload: populatedValidation,
    });
    return populatedValidation;
  };

  const populateAsyncValidation = (term: string) => {
    const populatedValidation = asyncValidation(term);
    validationDispatch({
      type: 'set-async-validation',
      payload: populatedValidation,
    });
    return populatedValidation;
  };

  const evaluateAsyncValidation = (
    formError: string | string[] | FormikErrors<any> | FormikErrors<any>[] | undefined,
  ) => {
    validationDispatch({
      type: 'set-async-validation',
      payload: validationState.asyncValidation.map((v) => ({
        ...v,
        validated: v.text !== formError,
      })),
    });
  };

  useEffect(() => {
    // `false` means the form validation execution has ended (as opposed to `undefined`)
    if (isFormValidating === false && inputValue) {
      evaluateAsyncValidation(error);
    }
  }, [error, isFormValidating]);

  useEffect(() => {
    setAsyncValidating(!!isFormValidating);
  }, [isFormValidating]);

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
    validateField(inputName);
  }, []);

  return (
    <FormGroup
      fieldId={inputName}
      validated={isValid ? 'default' : 'error'}
      label={label}
      isRequired={isRequired}
      labelIcon={extendedHelpText ? <PopoverHint hint={extendedHelpText} /> : undefined}
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
                  isValid={!!item.validated}
                  isValidating={!!item.validating}
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
            autoComplete="off"
            aria-invalid={!isValid}
            onBlur={() => {
              setIsFocused(false);
              setShowPopover(false);
              validateField(inputName);
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
            hasFailures={hasFailures}
            isValidating={isValidating}
            onClick={(e) => {
              e.stopPropagation();
              setShowPopover(true);
              textInputRef.current?.focus();
            }}
          />
        </InputGroup>
      </Popover>
    </FormGroup>
  );
};
