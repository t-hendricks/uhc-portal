import React from 'react';
import { FormGroup, Select, SelectOption, SelectOptionObject } from '@patternfly/react-core';
import { FormikValues, useField, useFormikContext } from 'formik';

interface BooleanDropdownFieldProps {
  name: string;
  label?: string;
  helperText?: React.ReactNode;
}

const isTrue = (sel: SelectOptionObject) => sel.toString() === 'true';
const isFalse = (sel: SelectOptionObject) => sel.toString() === 'false';

const trueOption = {
  toString: () => 'true',
  compareTo: isTrue,
};

const falseOption = {
  toString: () => 'false',
  compareTo: isFalse,
};

const options = [trueOption, falseOption];

export const BooleanDropdownField = ({ name, label, helperText }: BooleanDropdownFieldProps) => {
  const [field, { touched, error }] = useField<string[]>(name);
  const { setFieldValue, setFieldTouched } = useFormikContext<FormikValues>();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const isValid = !(touched && error);

  const onToggle = () => {
    setIsOpen(!isOpen);
  };

  const onSelect = (event: React.MouseEvent | React.ChangeEvent, selection: SelectOptionObject) => {
    setFieldValue(name, isTrue(selection));
    setFieldTouched(name);
    setIsOpen(false);
  };

  return (
    <FormGroup
      fieldId={name}
      label={label}
      validated={isValid ? 'default' : 'error'}
      helperText={helperText}
    >
      <Select
        onToggle={onToggle}
        onSelect={onSelect}
        isOpen={isOpen}
        selections={field.value ? trueOption : falseOption}
      >
        {options.map((opObj) => (
          <SelectOption value={opObj} key={opObj.toString()} />
        ))}
      </Select>
    </FormGroup>
  );
};
