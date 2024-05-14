import * as React from 'react';
import { useField } from 'formik';

import { Button, FormGroup, Icon, Popover, TextInput } from '@patternfly/react-core';
import { HelpIcon } from '@patternfly/react-icons/dist/esm/icons/help-icon';

import { FormGroupHelperText } from '../FormGroupHelperText';

type TextFieldProps = {
  fieldId: string;
  label?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  helpText?: string;
};

const TextField = ({ fieldId, label, isRequired, isDisabled, helpText }: TextFieldProps) => {
  const [field, { error, touched }] = useField(fieldId);

  const labelIcon = helpText ? (
    <Popover bodyContent={<p>{helpText}</p>}>
      <Button variant="plain" isInline>
        <Icon size="md">
          <HelpIcon />
        </Icon>
      </Button>
    </Popover>
  ) : undefined;

  return (
    <FormGroup fieldId={fieldId} label={label} labelIcon={labelIcon} isRequired={isRequired}>
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
