import React from 'react';

import { Button, useWizardContext } from '@patternfly/react-core';

import { getAccountAndRolesStepId } from '~/components/clusters/wizards/rosa/rosaWizardConstants';
import { useFeatureGate } from '~/hooks/useFeatureGate';
import { HYPERSHIFT_WIZARD_FEATURE } from '~/redux/constants/featureConstants';

export const BackToAssociateAwsAccountLink = () => {
  const { goToStepById } = useWizardContext();
  const isHypershiftEnabled = useFeatureGate(HYPERSHIFT_WIZARD_FEATURE);
  const accountStepId = getAccountAndRolesStepId(isHypershiftEnabled);
  return (
    <Button variant="link" isInline onClick={() => goToStepById(accountStepId)}>
      Back to associate AWS account
    </Button>
  );
};
