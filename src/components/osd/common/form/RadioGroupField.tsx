import React from 'react';
import { RadioButtonField } from 'formik-pf';

import { FormGroup, Split, SplitItem, Tooltip } from '@patternfly/react-core';

import PopoverHint from '~/components/common/PopoverHint';
import { useFormState } from '../../hooks';

interface RadioGroupOption {
  value: string;
  label: string;
  disabled?: boolean;
  tooltipText?: string;
  extendedHelpText?: string;
}

interface RadioGroupFieldProps {
  name: string;
  label: string;
  options: RadioGroupOption[];
  onChange?(value: string): void;
  isInline?: boolean;
  isRequired?: boolean;
}

export const RadioGroupField = ({
  name,
  label,
  options,
  onChange,
  isInline,
  isRequired,
}: RadioGroupFieldProps) => {
  const { setFieldValue } = useFormState();

  return (
    <FormGroup label={label} fieldId={name} isRequired={isRequired} isInline={isInline}>
      <Split hasGutter>
        {options.map((option) => {
          const radioButton = (
            <SplitItem>
              <RadioButtonField
                name={name}
                label={option.label}
                value={option.value}
                className="pf-u-mb-md"
                onChange={(value) => {
                  setFieldValue(name, value);
                  onChange?.(value?.toString());
                }}
              />
            </SplitItem>
          );

          return (
            <React.Fragment key={option.value}>
              {option.tooltipText ? (
                <Tooltip content={option.tooltipText} position="right">
                  {radioButton}
                </Tooltip>
              ) : (
                radioButton
              )}
              {option.extendedHelpText && (
                <SplitItem>
                  <PopoverHint hint={option.extendedHelpText} />
                </SplitItem>
              )}
            </React.Fragment>
          );
        })}
      </Split>
    </FormGroup>
  );
};
