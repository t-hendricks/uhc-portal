import React from 'react';
import { WrappedFieldInputProps, WrappedFieldMetaProps } from 'redux-form';

import { Flex, FormGroup, LabelProps } from '@patternfly/react-core';
import {
  Select as SelectDeprecated,
  SelectOption as SelectOptionDeprecated,
  SelectOptionObject as SelectOptionObjectDeprecated,
} from '@patternfly/react-core/deprecated';

import { FormGroupHelperText } from '../FormGroupHelperText';
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
    _: React.MouseEvent<Element, MouseEvent> | React.ChangeEvent<Element>,
    value: string | SelectOptionObjectDeprecated,
  ) => {
    input.onChange(value);
    setIsExpanded(false);
  };

  const formSelect = (
    <SelectDeprecated
      {...input}
      id={input.name}
      name={input.name}
      isDisabled={disabled}
      isOpen={isExpanded}
      selections={input.value}
      onToggle={(_event, isExpanded) => setIsExpanded(isExpanded)}
      onSelect={onSelect}
      onBlur={(event) => event.stopPropagation()}
      {...extraProps}
    >
      {options.map((option) => (
        <SelectOptionDeprecated key={option.value} value={option.value}>
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
        </SelectOptionDeprecated>
      ))}
    </SelectDeprecated>
  );

  return isFormGroup ? (
    <FormGroup
      fieldId={input.name}
      label={label}
      isRequired={isRequired}
      labelIcon={extendedHelpText ? <PopoverHint hint={extendedHelpText} /> : undefined}
    >
      {formSelect}

      <FormGroupHelperText touched={touched} error={error}>
        {helpText}
      </FormGroupHelperText>
    </FormGroup>
  ) : (
    formSelect
  );
};
