import * as React from 'react';
import { useField } from 'formik';

import { FormGroup, TextInput } from '@patternfly/react-core';

import { FormGroupHelperText } from '../FormGroupHelperText';

type TextFieldProps = {
  fieldId: string;
  label?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
};

const TextField = ({ fieldId, label, isRequired, isDisabled }: TextFieldProps) => {
  const [field, { error, touched }] = useField(fieldId);

  return (
    <FormGroup fieldId={fieldId} label={label} isRequired={isRequired}>
      <TextInput
        {...field}
        id={fieldId}
        onChange={(event, value) => {
          field.onChange(event);
        }}
        isDisabled={isDisabled}
      />

      <FormGroupHelperText touched={touched} error={error} />
    </FormGroup>
  );
};

export default TextField;
