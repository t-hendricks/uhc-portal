import { useField } from 'formik';
import * as React from 'react';
import { SubnetSelectField } from '~/components/clusters/CreateOSDPage/CreateOSDWizard/NetworkScreen/SubnetSelectField';
import useFormikOnChange from '../hooks/useFormikOnChange';

const fieldId = 'subnet';

const SubnetField = () => {
  const [inputField, metaField] = useField(fieldId);

  const onChange = useFormikOnChange(fieldId);

  const fieldProps = React.useMemo(
    () => ({
      input: {
        onChange,
        value: inputField.value,
        name: inputField.name,
      },
      meta: {
        error: metaField.touched ? metaField.error : undefined,
        touched: metaField.touched,
      },
    }),
    [inputField.value, inputField.name, metaField.error, metaField.touched, onChange],
  );

  return (
    <SubnetSelectField
      name={fieldId}
      privacy="private"
      label="Private subnet name"
      isRequired
      {...fieldProps}
    />
  );
};

export default SubnetField;
