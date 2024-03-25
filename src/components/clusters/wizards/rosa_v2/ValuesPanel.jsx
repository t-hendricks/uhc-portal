import React from 'react';
import { useFormikContext } from 'formik';
import { ValuesCodeEditor } from '~/components/clusters/wizards/common/ValuesCodeEditor';

export const ValuesPanel = () => {
  const { values, errors, touched } = useFormikContext();
  return (
    <pre
      style={{
        fontSize: '.65rem',
        flex: '0 0 35em',
      }}
    >
      <div>
        <strong>formik values:</strong>
      </div>
      <ValuesCodeEditor code={JSON.stringify(values, null, 2)} />
      <div>
        <strong>formik touched:</strong>
      </div>
      <ValuesCodeEditor code={JSON.stringify(touched, null, 2)} />
      <div>
        <strong>formik errors:</strong>
      </div>
      <ValuesCodeEditor code={JSON.stringify(errors, null, 2)} />
    </pre>
  );
};
