import React from 'react';
import classNames from 'classnames';
import { RadioButtonField } from 'formik-pf';

import { FormGroup, Flex, Tooltip } from '@patternfly/react-core';

import PopoverHint from '~/components/common/PopoverHint';
import { useFormState } from '~/components/clusters/wizards/hooks';

enum RadioGroupDirection {
  Row = 'row',
  Column = 'column',
}

export interface RadioGroupOption {
  value: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
  tooltip?: React.ReactNode;
  popoverHint?: React.ReactNode;
}

interface RadioGroupFieldProps {
  name: string;
  options: RadioGroupOption[];
  label?: React.ReactNode;
  isRequired?: boolean;
  direction?: 'row' | 'column';
  onChange?(value: string): void;
}

export const RadioGroupField = ({
  name,
  label,
  options,
  onChange,
  isRequired,
  direction = RadioGroupDirection.Column,
}: RadioGroupFieldProps) => {
  const { setFieldValue } = useFormState();

  return (
    <FormGroup label={label} fieldId={name} isRequired={isRequired}>
      <Flex
        direction={{ default: direction }}
        spaceItems={{
          default: `spaceItems${direction === RadioGroupDirection.Column ? 'Md' : 'Lg'}`,
        }}
      >
        {options.map((option) => {
          const radioButton = (
            <RadioButtonField
              name={name}
              label={option.label}
              value={option.value}
              isDisabled={option.disabled}
              description={option.description}
              className={classNames('pf-u-mb-md', { 'pf-u-mr-sm': !!option.popoverHint })}
              onChange={(value) => {
                setFieldValue(name, value);
                onChange?.(value?.toString());
              }}
            />
          );

          return (
            <Flex alignItems={{ default: 'alignItemsFlexStart' }} key={option.value}>
              {option.tooltip ? (
                <Tooltip content={option.tooltip} position="right">
                  {radioButton}
                </Tooltip>
              ) : (
                radioButton
              )}

              {option.popoverHint && <PopoverHint hint={option.popoverHint} />}
            </Flex>
          );
        })}
      </Flex>
    </FormGroup>
  );
};
