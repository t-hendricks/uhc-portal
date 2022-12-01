import React from 'react';
import { FieldInputProps, FieldMetaProps } from 'formik';
import { NumberInput } from '@patternfly/react-core';

interface NodesInputProps {
  input: FieldInputProps<string>;
  meta: FieldMetaProps<string>;
  ariaLabel: string;
  displayError(limit: string, error: string): void;
  hideError(limit: string): void;
  limit: string;
  min: number;
  max: number;
}

export const NodesInput = ({
  min,
  max,
  input,
  meta: { touched, error },
  displayError,
  hideError,
  limit,
  ariaLabel,
}: NodesInputProps) => {
  React.useEffect(() => {
    if (touched && error) {
      displayError(limit, error);
    } else {
      hideError(limit);
    }
  }, [touched, error, limit, displayError, hideError]);

  const onButtonPress = (plus: boolean) => () => {
    // base cases
    if (Number.isNaN(parseInt(input.value, 10))) {
      // empty field, then pressing a button
      return input.onChange(min);
    }
    if (parseInt(input.value, 10) < min) {
      // user entered a value that is less than min, then pressing a button
      return input.onChange(min);
    }
    if (parseInt(input.value, 10) > max) {
      // user entered a value greater than max, then pressing a button
      return input.onChange(max);
    }

    // normal cases
    if (plus) {
      // user pressed the plus button
      return input.onChange(parseInt(input.value, 10) + 1);
    }
    // user pressed the minus button
    return input.onChange(parseInt(input.value, 10) - 1);
  };

  return (
    <NumberInput
      value={parseInt(input.value, 10)}
      min={min}
      max={max}
      onMinus={onButtonPress(false)}
      onChange={(event) => input.onChange(Number((event.target as HTMLInputElement).value))}
      onPlus={onButtonPress(true)}
      inputAriaLabel={ariaLabel}
      widthChars={4}
      inputProps={{
        onBlur: (event: React.ChangeEvent<HTMLInputElement>) => {
          // strips unnecessary leading zeros
          // https://issues.redhat.com/browse/HAC-830
          // eslint-disable-next-line no-param-reassign
          event.target.value = Number(event.target.value).toString();
          input.onBlur(event);
        },
      }}
    />
  );
};
