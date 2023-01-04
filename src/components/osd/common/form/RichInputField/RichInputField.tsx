import React, { createRef, useState, useEffect, useReducer } from 'react';
import { WrappedFieldInputProps } from 'redux-form';
import { FormGroup, TextInput, InputGroup, Popover, HelperText } from '@patternfly/react-core';

import { evaluateClusterNameAsyncValidation } from '~/common/validators';
import PopoverHint from '~/components/common/PopoverHint';
import { ValidationItem } from '../../ValidationItem';
import { ValidationIconButton } from '../../ValidationIconButton';

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
        validated?: boolean;
        text: string;
      }[];
    }
  | {
      type: 'set-async-validating';
      payload: boolean;
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
          validating: !!action.payload,
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
  const inputName = input ? input.name : name;
  const inputOnChange = input ? input.onChange : onChange;

  const textInputRef = createRef<HTMLInputElement>();

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
  const isValid = !touched || !evaluatedValidation.some((item) => item.validated === false);
  const isValidating = touched && validationState.asyncValidation.some((item) => item.validating);

  let inputClassName = 'rich-input-field_info';
  if (touched && !isValidating) {
    inputClassName = isValid ? 'rich-input-field_valid' : 'rich-input-field_not-valid';
  }

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

  const evaluateAsyncValidation = async (term: string) => {
    validationDispatch({ type: 'set-async-validating', payload: true });
    const evaluatedAsyncValidation = await evaluateClusterNameAsyncValidation(term);
    validationDispatch({ type: 'set-async-validation', payload: evaluatedAsyncValidation });
    validationDispatch({ type: 'set-async-validating', payload: false });
  };

  const triggerAsyncValidation = async (blurEvent?: React.FocusEvent<HTMLInputElement>) => {
    // triggers the form async validation (to prevent "next" navigation if field is invalid)
    input?.onBlur(blurEvent);
    // recalculates the component data for rendering
    await evaluateAsyncValidation(textInputRef?.current?.value ?? inputValue);
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
              textInputRef.current?.focus();
            }}
          />
        </InputGroup>
      </Popover>
    </FormGroup>
  );
};
