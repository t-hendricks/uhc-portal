import React, { useContext } from 'react';
import { Button, WizardContext } from '@patternfly/react-core';
import { getAccountAndRolesStepId } from '~/components/clusters/CreateROSAPage/CreateROSAWizard/rosaWizardConstants';
import { HYPERSHIFT_WIZARD_FEATURE } from '~/redux/constants/featureConstants';
import { useFeatureGate } from '~/hooks/useFeatureGate';

export const BackToAssociateAwsAccountLink = () => {
  const { goToStepById } = useContext(WizardContext);
  const isHypershiftEnabled = useFeatureGate(HYPERSHIFT_WIZARD_FEATURE);
  const accountStepId = getAccountAndRolesStepId(isHypershiftEnabled);
  return (
    <Button variant="link" isInline onClick={() => goToStepById(accountStepId)}>
      Back to associate AWS account
    </Button>
  );
};
