import React, { useEffect, useState } from 'react';
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
  const {
    onNext: goToNextStep,
    onBack: goToPrevStep,
    onClose: close,
    activeStep,
    steps,
  } = useWizardContext();
  const { values, validateForm, setTouched, isValidating } = useFormState();
  // used to determine the actions' disabled state.
  // (as a more exclusive rule than isValidating, which relying upon would block progress to the next step)
  const [isNextDeferred, setIsNextDeferred] = useState<boolean>(false);

  const isButtonLoading = isValidating || isLoading;
  const isButtonDisabled = isNextDeferred || isLoading;

  const onValidateNext = async () => {
    // defer execution until any ongoing validation is done
    if (isValidating) {
      if (!isNextDeferred) {
        setIsNextDeferred(true);
      }
      return;
    }

    const errors = await validateForm(values);

    if (Object.keys(errors || {}).length > 0) {
      setTouched(setNestedObjectValues(errors, true));
      scrollToFirstError(getScrollErrorIds(errors));

      return;
    }

    (onNext ?? goToNextStep)();
  };

  useEffect(() => {
    // if "next" invocation was deferred due to earlier ongoing validation,
    // revive the invocation when the validation is done.
    if (isNextDeferred && isValidating === false) {
      setIsNextDeferred(false);
      onValidateNext();
    }
  }, [isValidating, isNextDeferred]);

  return (
    <WizardFooterWrapper>
      <Button
        variant="primary"
        onClick={onValidateNext}
        isLoading={isButtonLoading}
        isDisabled={isButtonDisabled}
      >
        Next
      </Button>
      <Button
        variant="secondary"
        onClick={goToPrevStep}
        isDisabled={isButtonDisabled || steps.indexOf(activeStep) === 0}
      >
        Back
      </Button>
      <Button variant="link" onClick={close} isDisabled={isButtonDisabled}>
        Cancel
      </Button>
    </WizardFooterWrapper>
  );
};
