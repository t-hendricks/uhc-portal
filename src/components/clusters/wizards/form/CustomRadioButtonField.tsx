/**
 * Taken from https://github.com/patternfly-labs/formik-pf/blob/main/src/components/RadioButtonField/RadioButtonField.tsx
 * Adjusted ability to target a radio button
 */
import React from 'react';
import { Radio, FormGroupProps } from '@patternfly/react-core';
import { useField, useFormikContext, FormikValues } from 'formik';

type FieldProps = {
  name: string;
  isDisabled?: boolean;
  dataTest?: string;
} & FormGroupProps;

const getFieldId = (fieldName: string, fieldType: string) =>
  `form-${fieldType}-${fieldName?.replace(/\./g, '-')}-field`;

type RadioButtonFieldProps = Omit<FieldProps, 'ref'> & {
  value: React.ReactText;
  description?: React.ReactNode;
  onChange?: (value: React.ReactText) => void;
  shouldCheck?: (fieldValue: string, radioValue: React.ReactText) => boolean;
};

export const RadioButtonField: React.FC<RadioButtonFieldProps> = ({
  name,
  label,
  value,
  onChange,
  shouldCheck,
  ...props
}) => {
  const [field, { touched, error }] = useField(name);
  const { setFieldValue, setFieldTouched } = useFormikContext<FormikValues>();
  const fieldId = getFieldId(`${name}-${value}`, 'radiobutton');
  const isValid = !(touched && error);
  return (
    <Radio
      {...field}
      {...props}
      id={fieldId}
      value={value}
      label={label}
      isChecked={shouldCheck ? shouldCheck(field.value, value) : field.value === value}
      isValid={isValid}
      isDisabled={props.isDisabled}
      aria-label={`${fieldId}-${label}`}
      onChange={() => {
        if (onChange) {
          onChange(value);
        } else {
          setFieldValue(name, value);
        }
        setFieldTouched(name, true);
      }}
    />
  );
};
