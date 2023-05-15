import React from 'react';
import { WrappedFieldInputProps, WrappedFieldMetaProps } from 'redux-form';

import {
  Flex,
  FormGroup,
  LabelProps,
  Select,
  SelectOption,
  SelectOptionObject,
} from '@patternfly/react-core';
import PopoverHint from '../PopoverHint';

interface ReduxSelectOption {
  name: string;
  value: string;
  label?: React.ReactElement<LabelProps>;
}

interface ReduxSelectDropdownProps {
  options: ReduxSelectOption[];
  label: string;
  helpText: string;
  meta: WrappedFieldMetaProps;
  input: WrappedFieldInputProps;
  disabled: boolean;
  isFormGroup: boolean;
  isRequired: boolean;
  extendedHelpText: React.ReactNode;
}

export const ReduxSelectDropdown = ({
  options,
  label,
  helpText,
  meta: { error, touched },
  input,
  disabled,
  isFormGroup = true,
  isRequired,
  extendedHelpText,
  ...extraProps
}: ReduxSelectDropdownProps) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const onSelect = (
    event: React.MouseEvent<Element, MouseEvent> | React.ChangeEvent<Element>,
    value: string | SelectOptionObject,
  ) => {
    input.onChange(value);
    setIsExpanded(false);
  };

  const formSelect = (
    <Select
      {...input}
      id={input.name}
      name={input.name}
      isDisabled={disabled}
      isOpen={isExpanded}
      selections={input.value}
      onToggle={(isExpanded) => setIsExpanded(isExpanded)}
      onSelect={onSelect}
      onBlur={(event) => event.stopPropagation()}
      {...extraProps}
    >
      {options.map((option) => (
        <SelectOption key={option.value} value={option.value}>
          {option.label ? (
            <Flex
              flexWrap={{ default: 'nowrap' }}
              spaceItems={{ default: 'spaceItemsSm' }}
              alignItems={{ default: 'alignItemsCenter' }}
            >
              <span>{option.name}</span>
              {option.label}
            </Flex>
          ) : (
            option.name
          )}
        </SelectOption>
      ))}
    </Select>
  );

  return isFormGroup ? (
    <FormGroup
      fieldId={input.name}
      label={label}
      validated={touched && error ? 'error' : 'default'}
      isRequired={isRequired}
      labelIcon={extendedHelpText ? <PopoverHint hint={extendedHelpText} /> : undefined}
      helperText={helpText}
      helperTextInvalid={touched && error ? `${helpText} ${error}` : ''}
    >
      {formSelect}
    </FormGroup>
  ) : (
    formSelect
  );
};
