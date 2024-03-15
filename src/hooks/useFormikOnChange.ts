import * as React from 'react';
import { useField } from 'formik';

/*
 * NOTE: This hook appears to cause an issue where the validate function of the Field is not triggered
 */

// workaround for formik bug https://github.com/jaredpalmer/formik/issues/2083
// when calling setValue, formik may validate the form with the old value instead of the new one
const useFormikOnChange = <V>(fieldId: string) => {
  const [_, __, { setValue, setTouched }] = useField<V>(fieldId);

  const onChange = React.useCallback((newValueOrEvent: V, newValue?: V) => {
    setValue(newValue !== undefined ? newValue : newValueOrEvent);
    setTimeout(() => setTouched(true, true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return onChange;
};

export default useFormikOnChange;
