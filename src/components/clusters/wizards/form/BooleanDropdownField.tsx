import React from 'react';
import { FormikValues, useField, useFormikContext } from 'formik';

import { FormGroup } from '@patternfly/react-core';
import {
  Select as SelectDeprecated,
  SelectOption as SelectOptionDeprecated,
  SelectOptionObject as SelectOptionObjectDeprecated,
} from '@patternfly/react-core/deprecated';

import { FormGroupHelperText } from '~/components/common/FormGroupHelperText';

interface BooleanDropdownFieldProps {
  name: string;
  label?: string;
  helperText?: React.ReactNode;
  isDisabled?: boolean;
}

const isTrue = (sel: SelectOptionObjectDeprecated) => sel.toString() === 'true';
const isFalse = (sel: SelectOptionObjectDeprecated) => sel.toString() === 'false';

const trueOption = {
  toString: () => 'true',
  compareTo: isTrue,
};

const falseOption = {
  toString: () => 'false',
  compareTo: isFalse,
};

const options = [trueOption, falseOption];

export const BooleanDropdownField = ({
  name,
  label,
  helperText,
  isDisabled,
}: BooleanDropdownFieldProps) => {
  const [field, { touched, error }] = useField<string[]>(name);
  const { setFieldValue, setFieldTouched } = useFormikContext<FormikValues>();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const onToggle = () => {
    setIsOpen(!isOpen);
  };

  const onSelect = (
    event: React.MouseEvent | React.ChangeEvent,
    selection: SelectOptionObjectDeprecated,
  ) => {
    setFieldValue(name, isTrue(selection));
    setFieldTouched(name);
    setIsOpen(false);
  };

  return (
    <FormGroup role="group" fieldId={name} label={label}>
      <SelectDeprecated
        onToggle={onToggle}
        onSelect={onSelect}
        isOpen={isOpen}
        isDisabled={isDisabled}
        selections={field.value ? trueOption : falseOption}
      >
        {options.map((opObj) => (
          <SelectOptionDeprecated value={opObj} key={opObj.toString()} />
        ))}
      </SelectDeprecated>

      <FormGroupHelperText touched={touched} error={error}>
        {helperText}
      </FormGroupHelperText>
    </FormGroup>
  );
};
