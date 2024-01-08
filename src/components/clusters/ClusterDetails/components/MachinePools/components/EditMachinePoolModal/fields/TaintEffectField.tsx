import { SelectOption as SelectOptionDeprecated } from '@patternfly/react-core/deprecated';
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
      <SelectOptionDeprecated value="NoSchedule">NoSchedule</SelectOptionDeprecated>
      <SelectOptionDeprecated value="NoExecute">NoExecute</SelectOptionDeprecated>
      <SelectOptionDeprecated value="PreferNoSchedule">PreferNoSchedule</SelectOptionDeprecated>
    </SelectField>
  );
};

export default TaintEffectField;
