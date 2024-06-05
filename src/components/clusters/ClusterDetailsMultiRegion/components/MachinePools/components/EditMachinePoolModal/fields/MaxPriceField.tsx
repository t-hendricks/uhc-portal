import * as React from 'react';
import { useField } from 'formik';

import { FormGroup, NumberInput } from '@patternfly/react-core';

import { SPOT_MIN_PRICE } from '~/components/clusters/common/machinePools/constants';
import { FormGroupHelperText } from '~/components/common/FormGroupHelperText';
import useFormikOnChange from '~/hooks/useFormikOnChange';

import { EditMachinePoolValues } from '../hooks/useMachinePoolFormik';

import './MaxPriceField.scss';

type MaxPriceFieldProps = {
  isEdit: boolean;
};

const fieldId = 'maxPrice';

const MaxPriceField = ({ isEdit }: MaxPriceFieldProps) => {
  const [maxPriceField, { error, touched }] = useField<EditMachinePoolValues['maxPrice']>(fieldId);

  const onChange = useFormikOnChange(fieldId);

  return (
    <FormGroup fieldId="maxPrice" isRequired>
      <NumberInput
        {...maxPriceField}
        id="maxPrice"
        onPlus={() => {
          const newValue = Number((parseFloat(`${maxPriceField.value}`) + 0.01).toFixed(2));
          onChange(newValue);
        }}
        onMinus={() => {
          const newValue = Number((parseFloat(`${maxPriceField.value}`) - 0.01).toFixed(2));
          onChange(newValue);
        }}
        onChange={(e) => {
          const newHourlyMaxPriceNum = parseFloat((e.target as any).value);
          const newValue = Number(newHourlyMaxPriceNum.toFixed(2));
          onChange(newValue);
        }}
        unit={<span className="ocm-spot-instances__unit">$ Hourly</span>}
        widthChars={8}
        min={SPOT_MIN_PRICE}
        isDisabled={isEdit}
      />

      <FormGroupHelperText touched={touched} error={error} />
    </FormGroup>
  );
};

export default MaxPriceField;
