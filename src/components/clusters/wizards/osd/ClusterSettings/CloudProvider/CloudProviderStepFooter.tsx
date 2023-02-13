import React from 'react';
import { useDispatch } from 'react-redux';

import { useWizardContext } from '@patternfly/react-core/dist/esm/next';
import { useFormState } from '~/components/clusters/wizards/hooks';
import { useGlobalState } from '~/redux/hooks';
import {
  getCloudProverInfo,
  shouldValidateCcsCredentials,
} from '~/components/clusters/wizards/common/utils';
import { CreateOsdWizardFooter } from '~/components/clusters/wizards/osd/CreateOsdWizardFooter';

export const CloudProviderStepFooter = () => {
  const dispatch = useDispatch();
  const { values } = useFormState();
  const { onNext: goToNextStep } = useWizardContext();
  const { ccsCredentialsValidity } = useGlobalState((state) => state.ccsInquiries);
  const { pending: isValidatingCcsCredentials } = ccsCredentialsValidity;

  const onNext = async () => {
    const validateCcsCredentials = shouldValidateCcsCredentials(values, ccsCredentialsValidity);

    if (validateCcsCredentials) {
      await getCloudProverInfo(values, dispatch);
    }

    goToNextStep();
  };

  return <CreateOsdWizardFooter onNext={onNext} isLoading={isValidatingCcsCredentials} />;
};
