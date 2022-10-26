import React from 'react';
import { useFormikContext, FormikValues } from 'formik';

import { Button } from '@patternfly/react-core';
import { useWizardContext, useWizardFooter } from '@patternfly/react-core/dist/esm/next';

export const ReviewAndCreate = () => {
  const { onBack, onClose } = useWizardContext();
  const { values, submitForm } = useFormikContext<FormikValues>();

  useWizardFooter(
    React.useMemo(
      () => (
        <footer className="pf-c-wizard__footer">
          <Button variant="primary" onClick={submitForm}>
            Create cluster
          </Button>
          <Button variant="secondary" onClick={onBack}>
            Back
          </Button>
          <Button variant="link" onClick={onClose}>
            Cancel
          </Button>
        </footer>
      ),
      [onBack, onClose, submitForm],
    ),
  );

  return <pre>{JSON.stringify(values, null, 2)}</pre>;
};
