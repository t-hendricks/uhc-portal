import { FormSelect, FormSelectOption } from '@patternfly/react-core';
import { useField } from 'formik';
import * as React from 'react';

export type TaintEffect = 'NoSchedule' | 'NoExecute' | 'PreferNoSchedule';

type TaintEffectFieldProps = {
  fieldId: string;
  isDisabled: boolean;
};

const TaintEffectField = ({ fieldId, isDisabled }: TaintEffectFieldProps) => {
  const [field] = useField<TaintEffect>(fieldId);
  return (
    <FormSelect
      {...field}
      id={fieldId}
      onChange={(val, event) => field.onChange(event)}
      isDisabled={isDisabled}
    >
      <FormSelectOption label="NoSchedule" value="NoSchedule" />
      <FormSelectOption label="NoExecute" value="NoExecute" />
      <FormSelectOption label="PreferNoSchedule" value="PreferNoSchedule" />
    </FormSelect>
  );
};

export default TaintEffectField;
