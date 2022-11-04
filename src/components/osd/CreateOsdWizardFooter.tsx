import React from 'react';
import { useDispatch } from 'react-redux';
import { FormikValues, useFormikContext } from 'formik';

import { Button } from '@patternfly/react-core';
import { useWizardContext } from '@patternfly/react-core/dist/esm/next';

import { useGlobalState } from '~/redux/hooks/useGlobalState';
import { scrollToFirstError } from '~/common/helpers';
import { getCloudProverInfo, shouldValidateCcsCredentials } from './utils';
import { StepId } from './constants';

export const CreateOsdWizardFooter = () => {
  const dispatch = useDispatch();
  const ccsCredentialsValidity = useGlobalState(
    (state) => state.ccsInquiries.ccsCredentialsValidity,
  );
  const { onNext, onBack, onClose, activeStep, steps } = useWizardContext();
  const { values, validateForm, setTouched } = useFormikContext<FormikValues>();

  const onValidateNext = async () => {
    const validateCcsCredentials = shouldValidateCcsCredentials(values, ccsCredentialsValidity);
    const errors = await validateForm(values);
    const touched = Object.keys(errors).reduce((acc: Record<string, boolean>, fieldName) => {
      acc[fieldName] = true;
      return acc;
    }, {});

    if (Object.keys(errors || {}).length > 0) {
      setTouched(touched);
      scrollToFirstError(errors as Record<string, string>);
      return;
    }

    if (validateCcsCredentials && activeStep.id === StepId.ClusterSettingsCloudProvider) {
      // Only proceed to the next step if the validation is successful.
      await getCloudProverInfo(values, dispatch);
    }

    onNext();
  };

  return (
    <footer className="pf-c-wizard__footer">
      <Button variant="primary" onClick={onValidateNext}>
        Next
      </Button>
      <Button variant="secondary" onClick={onBack} isDisabled={steps.indexOf(activeStep) === 0}>
        Back
      </Button>
      <Button variant="link" onClick={onClose}>
        Cancel
      </Button>
    </footer>
  );
};
