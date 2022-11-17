import React from 'react';
import { useDispatch } from 'react-redux';

import { useWizardContext } from '@patternfly/react-core/dist/esm/next';

import { getCloudProverInfo, shouldValidateCcsCredentials } from '../../utils';
import { useFormState } from '../../hooks';
import { useGlobalState } from '~/redux/hooks';
import { CreateOsdWizardFooter } from '../../CreateOsdWizardFooter';

export const CloudProviderStepFooter = () => {
  const dispatch = useDispatch();
  const { values } = useFormState();
  const { onNext: goToNext } = useWizardContext();
  const { ccsCredentialsValidity } = useGlobalState((state) => state.ccsInquiries);
  const { pending: isValidatingCcsCredentials } = ccsCredentialsValidity;

  const onNext = async () => {
    const validateCcsCredentials = shouldValidateCcsCredentials(values, ccsCredentialsValidity);

    if (validateCcsCredentials) {
      await getCloudProverInfo(values, dispatch);
    }

    goToNext();
  };

  return <CreateOsdWizardFooter onNext={onNext} isLoading={isValidatingCcsCredentials} />;
};
