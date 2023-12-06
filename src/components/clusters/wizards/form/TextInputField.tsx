import React from 'react';

import { FormGroup, FormGroupProps, TextInput, TextInputProps } from '@patternfly/react-core';
import { Field, FieldConfig, FieldProps, FieldValidator } from 'formik';
import PopoverHint from '~/components/common/PopoverHint';

interface TextInputFieldProps {
  name: string;
  textInputClassName?: string;
  formGroupClassName?: string;
  label?: string;
  validate?: FieldValidator;
  isDisabled?: boolean;
  helperText?: React.ReactNode;
  tooltip?: React.ReactNode;
  field?: FieldConfig;
  formGroup?: FormGroupProps;
  input?: TextInputProps;
  type?: TextInputProps['type'];
  showHelpTextOnError?: boolean;
}

interface HelperTextInvalidProps {
  name?: string;
  meta: FieldProps['meta'];
  helpText?: string | React.ReactNode;
  showHelpTextOnError?: boolean;
  className?: string;
}

export const HelperTextInvalid = ({
  name,
  meta,
  showHelpTextOnError,
  helpText,
  className,
}: HelperTextInvalidProps) => {
  const { error, touched } = meta;
  const additionalClasses = className ? ` ${className}` : '';
  if (touched && error) {
    if (showHelpTextOnError && typeof helpText === 'string') {
      return (
        <>
          {helpText} {error}
        </>
      );
    }
    return (
      <div
        className={`pf-c-form__helper-text pf-m-error${additionalClasses}`}
        id={`${name}-helper`}
        aria-live="polite"
      >
        {showHelpTextOnError ? <span>{helpText} </span> : null}
        {error}
      </div>
    );
  }
  return null;
};

export const TextInputField = ({
  name,
  textInputClassName,
  formGroupClassName,
  label,
  validate,
  isDisabled,
  helperText,
  tooltip,
  field,
  formGroup,
  input,
  type,
  showHelpTextOnError,
}: TextInputFieldProps) => (
  <Field name={name} validate={validate} {...field}>
    {({ field, form, meta }: FieldProps) => (
      <FormGroup
        fieldId={field.name}
        label={label}
        className={formGroupClassName}
        validated={meta.touched && meta.error ? 'error' : 'default'}
        helperTextInvalid={
          <HelperTextInvalid
            meta={meta}
            helpText={helperText}
            showHelpTextOnError={showHelpTextOnError}
            name={name || field.name}
          />
        }
        helperText={helperText}
        {...(tooltip && { labelIcon: <PopoverHint hint={tooltip} /> })}
        {...(validate && { isRequired: true })}
        {...formGroup}
      >
        <TextInput
          id={field.name}
          className={textInputClassName}
          isDisabled={isDisabled}
          validated={meta.touched && meta.error ? 'error' : 'default'}
          onBlur={() => form.setFieldTouched(name, true)}
          onChange={(_, event) => field.onChange(event)}
          value={field.value || (type === 'number' ? 0 : '')}
          type={type}
          {...input}
        />
      </FormGroup>
    )}
  </Field>
);
