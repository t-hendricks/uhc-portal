import React from 'react';

import { Button } from '@patternfly/react-core';
import {
  useWizardContext,
  useWizardFooter,
  WizardFooterWrapper,
} from '@patternfly/react-core/dist/esm/next';

import { useFormState } from './hooks';

export const ReviewAndCreate = () => {
  const { onBack, onClose } = useWizardContext();
  const { values, submitForm } = useFormState();

  useWizardFooter(
    React.useMemo(
      () => (
        <WizardFooterWrapper>
          <Button variant="primary" onClick={submitForm}>
            Create cluster
          </Button>
          <Button variant="secondary" onClick={onBack}>
            Back
          </Button>
          <Button variant="link" onClick={onClose}>
            Cancel
          </Button>
        </WizardFooterWrapper>
      ),
      [onBack, onClose, submitForm],
    ),
  );

  return <pre>{JSON.stringify(values, null, 2)}</pre>;
};
