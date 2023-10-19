import { Select, SelectProps } from '@patternfly/react-core';
import * as React from 'react';

type SelectFieldProps = {
  value: string | undefined;
  fieldId: string;
  onSelect: (value: string) => void;
  isDisabled?: boolean;
  children: SelectProps['children'];
};

const SelectField = ({ value, fieldId, onSelect, isDisabled, children }: SelectFieldProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <Select
      selections={value}
      id={fieldId}
      onSelect={(_, newValue) => {
        onSelect(newValue as string);
        setIsOpen(false);
      }}
      isDisabled={isDisabled}
      isOpen={isOpen}
      onToggle={setIsOpen}
      menuAppendTo={document.getElementById('edit-mp-modal') || undefined}
      maxHeight={300}
    >
      {children}
    </Select>
  );
};

export default SelectField;
