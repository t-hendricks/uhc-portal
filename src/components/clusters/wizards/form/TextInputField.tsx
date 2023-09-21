import React from 'react';

import { FormGroup, FormGroupProps, TextInput, TextInputProps } from '@patternfly/react-core';
import { Field, FieldConfig, FieldProps, FieldValidator } from 'formik';
import PopoverHint from '~/components/common/PopoverHint';

interface TextInputFieldProps {
  name: string;
  label?: string;
  validate?: FieldValidator;
  isDisabled?: boolean;
  isPassword?: boolean;
  helperText?: React.ReactNode;
  tooltip?: React.ReactNode;
  field?: FieldConfig;
  formGroup?: FormGroupProps;
  input?: TextInputProps;
}

interface HelperTextInvalidProps {
  name: string;
  meta: FieldProps['meta'];
  helpText: string | React.ReactNode;
  showHelpTextOnError?: boolean;
}

const HelperTextInvalid = ({
  name,
  meta,
  showHelpTextOnError,
  helpText,
}: HelperTextInvalidProps) => {
  const { error, touched } = meta;
  if (touched && error) {
    if (showHelpTextOnError) {
      if (typeof helpText === 'string') {
        return (
          <>
            {helpText} {error}
          </>
        );
      }
      return (
        <div className="pf-c-form__helper-text pf-m-error" id={`${name}-helper`} aria-live="polite">
          {helpText} {error}
        </div>
      );
    }
    return <div className="pf-u-background-color-danger">{error}</div>;
  }
  return null;
};

export const TextInputField = ({
  name,
  label,
  validate,
  isDisabled,
  isPassword,
  helperText,
  tooltip,
  field,
  formGroup,
  input,
}: TextInputFieldProps) => (
  <Field name={name} validate={validate} {...field}>
    {({ field, form, meta }: FieldProps) => (
      <FormGroup
        fieldId={field.name}
        label={label}
        validated={meta.touched && meta.error ? 'error' : 'default'}
        helperTextInvalid={meta.touched && meta.error}
        helperText={helperText}
        {...(tooltip && { labelIcon: <PopoverHint hint={tooltip} /> })}
        {...(validate && { isRequired: true })}
        {...formGroup}
      >
        <TextInput
          id={field.name}
          isDisabled={isDisabled}
          validated={meta.touched && meta.error ? 'error' : 'default'}
          onBlur={() => form.setFieldTouched(name, true)}
          onChange={(_, event) => field.onChange(event)}
          value={field.value || ''}
          {...(isPassword && { type: 'password' })}
          {...input}
        />
      </FormGroup>
    )}
  </Field>
);
