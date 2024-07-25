import React from 'react';
import { FieldValidator, useField, useFormikContext } from 'formik';

import { Flex, FormGroup } from '@patternfly/react-core';
import {
  Select as SelectDeprecated,
  SelectOption as SelectOptionDeprecated,
  SelectOptionObject as SelectOptionObjectDeprecated,
} from '@patternfly/react-core/deprecated';

import { FormGroupHelperText } from '~/components/common/FormGroupHelperText';
import PopoverHint from '~/components/common/PopoverHint';

type Option = {
  value: string;
  name: string;
  label?: string;
};

type AddOnsFormDropdownProps = {
  options: Option[];
  label: string;
  name: string;
  disabled: boolean;
  isFormGroup: boolean;
  helperText: string;
  isRequired: boolean;
  extendedHelpText: string;
  fieldId: string;
  validate?: FieldValidator;
  validateOnSubmit?: boolean;
};

export const AddOnsFormDropdown = ({
  options,
  label,
  name,
  disabled,
  isFormGroup = true,
  helperText,
  isRequired,
  extendedHelpText,
  fieldId,
  validate,
  validateOnSubmit,
  ...extraProps
}: AddOnsFormDropdownProps) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const { setFieldValue } = useFormikContext();
  const [field, meta, form] = useField(fieldId);

  const onSelect = (
    _: React.MouseEvent<Element, MouseEvent> | React.ChangeEvent<Element>,
    value: string | SelectOptionObjectDeprecated,
  ) => {
    setFieldValue(fieldId, value);
    setIsExpanded(false);
  };

  const formSelect = (
    <SelectDeprecated
      placeholderText="-- Please Select --"
      variant="single"
      {...field}
      id={name}
      name={name}
      isDisabled={disabled}
      isOpen={isExpanded}
      selections={field.value}
      onToggle={(_event, isExpanded) => setIsExpanded(isExpanded)}
      validated={meta.touched || meta.error ? 'error' : 'default'}
      onSelect={onSelect}
      onBlur={() => form.setTouched(true, true)}
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
      {...(validate && { isRequired: true })}
      fieldId={name}
      label={label}
      isRequired={isRequired}
      labelIcon={extendedHelpText ? <PopoverHint hint={extendedHelpText} /> : undefined}
    >
      {formSelect}
      <FormGroupHelperText
        touched={meta.touched}
        error={meta.error}
        validateOnSubmit={validateOnSubmit}
      >
        {helperText}
      </FormGroupHelperText>
    </FormGroup>
  ) : (
    <>
      {formSelect}
      <FormGroupHelperText
        touched={meta.touched}
        error={meta.error}
        validateOnSubmit={validateOnSubmit}
      >
        {helperText}
      </FormGroupHelperText>
    </>
  );
};
