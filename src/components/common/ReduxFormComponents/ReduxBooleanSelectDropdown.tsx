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
  formGroupClass?: string;
}

export const ReduxBooleanSelectDropdown = ({
  label,
  helpText,
  meta: { error, touched },
  input,
  disabled,
  isFormGroup = true,
  isRequired,
  formGroupClass,
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
      selections={`${Boolean(input.value)}`}
      onToggle={(isExpanded) => setIsExpanded(isExpanded)}
      onSelect={onSelect}
      onBlur={(event) => event.stopPropagation()}
      {...extraProps}
    >
      <SelectOption value="true">
        <Flex
          flexWrap={{ default: 'nowrap' }}
          spaceItems={{ default: 'spaceItemsSm' }}
          alignItems={{ default: 'alignItemsCenter' }}
        >
          true
        </Flex>
      </SelectOption>
      <SelectOption value="false">
        <Flex
          flexWrap={{ default: 'nowrap' }}
          spaceItems={{ default: 'spaceItemsSm' }}
          alignItems={{ default: 'alignItemsCenter' }}
        >
          false
        </Flex>
      </SelectOption>
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
      className={formGroupClass}
    >
      {formSelect}
    </FormGroup>
  ) : (
    formSelect
  );
};
