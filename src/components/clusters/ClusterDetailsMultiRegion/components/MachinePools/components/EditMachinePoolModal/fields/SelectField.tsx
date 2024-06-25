import * as React from 'react';

import {
  Select as SelectDeprecated,
  SelectProps as SelectPropsDeprecated,
} from '@patternfly/react-core/deprecated';

type SelectFieldProps = {
  value: string | undefined;
  fieldId: string;
  onSelect: (value: string) => void;
  isDisabled?: boolean;
  children: SelectPropsDeprecated['children'];
};

const SelectField = ({ value, fieldId, onSelect, isDisabled, children }: SelectFieldProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <SelectDeprecated
      selections={value}
      id={fieldId}
      onSelect={(_, newValue) => {
        onSelect(newValue as string);
        setIsOpen(false);
      }}
      isDisabled={isDisabled}
      isOpen={isOpen}
      onToggle={(_, isOpen) => setIsOpen(isOpen)}
      menuAppendTo={document.getElementById('edit-mp-modal') || undefined}
      maxHeight={300}
    >
      {children}
    </SelectDeprecated>
  );
};

export default SelectField;
