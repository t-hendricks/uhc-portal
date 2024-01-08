import React from 'react';
import { WrappedFieldInputProps, WrappedFieldMetaProps } from 'redux-form';

import { Flex, FormGroup, LabelProps } from '@patternfly/react-core';
import {
  Select as SelectDeprecated,
  SelectOption as SelectOptionDeprecated,
  SelectOptionObject as SelectOptionObjectDeprecated,
} from '@patternfly/react-core/deprecated';
import PopoverHint from '../PopoverHint';
import { FormGroupHelperText } from '../FormGroupHelperText';

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
      selections={`${Boolean(input.value)}`}
      onToggle={(_event, isExpanded) => setIsExpanded(isExpanded)}
      onSelect={onSelect}
      onBlur={(event) => event.stopPropagation()}
      {...extraProps}
    >
      <SelectOptionDeprecated value="true">
        <Flex
          flexWrap={{ default: 'nowrap' }}
          spaceItems={{ default: 'spaceItemsSm' }}
          alignItems={{ default: 'alignItemsCenter' }}
        >
          true
        </Flex>
      </SelectOptionDeprecated>
      <SelectOptionDeprecated value="false">
        <Flex
          flexWrap={{ default: 'nowrap' }}
          spaceItems={{ default: 'spaceItemsSm' }}
          alignItems={{ default: 'alignItemsCenter' }}
        >
          false
        </Flex>
      </SelectOptionDeprecated>
    </SelectDeprecated>
  );

  return isFormGroup ? (
    <FormGroup
      fieldId={input.name}
      label={label}
      isRequired={isRequired}
      labelIcon={extendedHelpText ? <PopoverHint hint={extendedHelpText} /> : undefined}
      className={formGroupClass}
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
