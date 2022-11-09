import React from 'react';

import { Checkbox, CheckboxProps, Flex, FormGroup, FormGroupProps } from '@patternfly/react-core';
import { Field, FieldConfig, FieldProps, FieldValidator } from 'formik';
import PopoverHint from '~/components/common/PopoverHint';

interface CheckboxFieldProps {
  name: string;
  label?: string;
  validate?: FieldValidator;
  isDisabled?: boolean;
  tooltip?: React.ReactNode;
  field?: FieldConfig;
  formGroup?: FormGroupProps;
  input?: Omit<CheckboxProps, 'ref'>;
}

export const CheckboxField = ({
  name,
  label,
  validate,
  isDisabled,
  tooltip,
  field,
  formGroup,
  input,
}: CheckboxFieldProps) => (
  <Field name={name} validate={validate} {...field}>
    {({ field, form, meta }: FieldProps) => (
      <FormGroup
        fieldId={field.name}
        isRequired
        validated={meta.touched && meta.error ? 'error' : 'default'}
        helperTextInvalid={meta.touched && meta.error}
        {...(validate && { isRequired: true })}
        {...formGroup}
      >
        <Flex>
          <Checkbox
            id={field.name}
            label={label}
            isChecked={field.value}
            isDisabled={isDisabled}
            onBlur={() => form.setFieldTouched(name, true)}
            onChange={(_, event) => field.onChange(event)}
            value={field.value || false}
            {...input}
          />
          {tooltip && <PopoverHint hint={tooltip} />}
        </Flex>
      </FormGroup>
    )}
  </Field>
);
