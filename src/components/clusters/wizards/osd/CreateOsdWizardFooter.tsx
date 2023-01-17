import React from 'react';
import { setNestedObjectValues } from 'formik';

import { Button } from '@patternfly/react-core';
import { useWizardContext, WizardFooterWrapper } from '@patternfly/react-core/dist/esm/next';

import { scrollToFirstError } from '~/common/helpers';
import { getScrollErrorIds } from '~/components/clusters/wizards/form/utils';
import { useFormState } from '~/components/clusters/wizards/hooks';

interface CreateOsdWizardFooterProps {
  isLoading?: boolean;
  onNext?(): void | Promise<void>;
}

export const CreateOsdWizardFooter = ({ isLoading, onNext }: CreateOsdWizardFooterProps) => {
  const { onNext: goToNext, onBack, onClose, activeStep, steps } = useWizardContext();
  const { values, validateForm, setTouched } = useFormState();

  const onValidateNext = async () => {
    const errors = await validateForm(values);

    if (Object.keys(errors || {}).length > 0) {
      setTouched(setNestedObjectValues(errors, true));
      scrollToFirstError(getScrollErrorIds(errors));

      return;
    }

    (onNext ?? goToNext)();
  };

  return (
    <WizardFooterWrapper>
      <Button
        variant="primary"
        onClick={onValidateNext}
        {...(isLoading && { isLoading, isDisabled: isLoading })}
      >
        Next
      </Button>
      <Button
        variant="secondary"
        onClick={onBack}
        isDisabled={isLoading || steps.indexOf(activeStep) === 0}
      >
        Back
      </Button>
      <Button variant="link" onClick={onClose} isDisabled={isLoading}>
        Cancel
      </Button>
    </WizardFooterWrapper>
  );
};
