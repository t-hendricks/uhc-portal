import { FormGroup, TextInput } from '@patternfly/react-core';
import { useField } from 'formik';
import * as React from 'react';

type TextFieldProps = {
  fieldId: string;
  label?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
};

const TextField = ({ fieldId, label, isRequired, isDisabled }: TextFieldProps) => {
  const [field, { error, touched }] = useField(fieldId);

  return (
    <FormGroup
      fieldId={fieldId}
      label={label}
      isRequired={isRequired}
      validated={(touched || field.value) && error ? 'error' : 'default'}
      helperTextInvalid={touched || field.value ? error : undefined}
    >
      <TextInput
        {...field}
        id={fieldId}
        onChange={(value, event) => {
          field.onChange(event);
        }}
        isDisabled={isDisabled}
      />
    </FormGroup>
  );
};

export default TextField;
