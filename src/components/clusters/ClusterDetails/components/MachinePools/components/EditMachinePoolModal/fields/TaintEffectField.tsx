import { SelectOption } from '@patternfly/react-core';
import { useField } from 'formik';
import * as React from 'react';
import useFormikOnChange from '../hooks/useFormikOnChange';
import SelectField from './SelectField';

export type TaintEffect = 'NoSchedule' | 'NoExecute' | 'PreferNoSchedule';

type TaintEffectFieldProps = {
  fieldId: string;
  isDisabled: boolean;
};

const TaintEffectField = ({ fieldId, isDisabled }: TaintEffectFieldProps) => {
  const [field] = useField<TaintEffect>(fieldId);
  const onChange = useFormikOnChange(fieldId);
  return (
    <SelectField value={field.value} fieldId={fieldId} onSelect={onChange} isDisabled={isDisabled}>
      <SelectOption value="NoSchedule">NoSchedule</SelectOption>
      <SelectOption value="NoExecute">NoExecute</SelectOption>
      <SelectOption value="PreferNoSchedule">PreferNoSchedule</SelectOption>
    </SelectField>
  );
};

export default TaintEffectField;
