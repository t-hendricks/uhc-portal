import React from 'react';
import { getFormValues, getFormSyncErrors, getFormAsyncErrors, getFormMeta } from 'redux-form';
import { useSelector } from 'react-redux';
import { ValuesCodeEditor } from '~/components/clusters/wizards/common/ValuesCodeEditor';

export const ValuesPanel = () => {
  const formValues = useSelector((state) => getFormValues('CreateCluster')(state));
  const errors = useSelector((state) => ({
    ...getFormSyncErrors('CreateCluster')(state),
    ...getFormAsyncErrors('CreateCluster')(state),
  }));
  const touched = useSelector((state) => getFormMeta('CreateCluster')(state));
  return (
    <pre
      style={{
        fontSize: '.65rem',
        flex: '0 0 35em',
      }}
    >
      <div>
        <strong>redux-form values:</strong>
      </div>
      <ValuesCodeEditor code={JSON.stringify(formValues, null, 2)} />
      <div>
        <strong>redux-form touched:</strong>
      </div>
      <ValuesCodeEditor code={JSON.stringify(touched, null, 2)} />
      <div>
        <strong>redux-form errors:</strong>
      </div>
      <ValuesCodeEditor code={JSON.stringify(errors, null, 2)} />
    </pre>
  );
};
