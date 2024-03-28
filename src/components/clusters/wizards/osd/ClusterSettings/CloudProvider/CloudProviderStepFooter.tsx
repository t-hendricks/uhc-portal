import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { useWizardContext } from '@patternfly/react-core';
import { useFormState } from '~/components/clusters/wizards/hooks';
import { useGlobalState } from '~/redux/hooks';
import {
  getCloudProverInfo,
  shouldValidateCcsCredentials,
} from '~/components/clusters/wizards/common/utils/ccsCredentials';
import { CreateOsdWizardFooter } from '~/components/clusters/wizards/osd/CreateOsdWizardFooter';

export const CloudProviderStepFooter = () => {
  const dispatch = useDispatch();
  const { values } = useFormState();
  const { goToNextStep } = useWizardContext();
  const { ccsCredentialsValidity } = useGlobalState((state) => state.ccsInquiries);
  const [pendingValidation, setPendingValidation] = useState(false);

  const onNext = () => {
    const validateCcsCredentials = shouldValidateCcsCredentials(values, ccsCredentialsValidity);

    if (validateCcsCredentials) {
      getCloudProverInfo(values, dispatch);
      setPendingValidation(true);
    } else {
      goToNextStep();
    }
  };

  useEffect(() => {
    if (pendingValidation) {
      if (ccsCredentialsValidity.fulfilled || ccsCredentialsValidity.error) {
        setPendingValidation(false);
        if (ccsCredentialsValidity.fulfilled) {
          goToNextStep();
        }
      }
    }
  }, [
    pendingValidation,
    ccsCredentialsValidity.fulfilled,
    ccsCredentialsValidity.error,
    goToNextStep,
  ]);

  return <CreateOsdWizardFooter onNext={onNext} isLoading={pendingValidation} />;
};
