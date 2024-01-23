import React, { useContext } from 'react';
import { Button } from '@patternfly/react-core';
import { WizardContext as WizardContextDeprecated } from '@patternfly/react-core/deprecated';
import { getAccountAndRolesStepId } from '~/components/clusters/wizards/rosa_v1/rosaWizardConstants';
import { HYPERSHIFT_WIZARD_FEATURE } from '~/redux/constants/featureConstants';
import { useFeatureGate } from '~/hooks/useFeatureGate';

export const BackToAssociateAwsAccountLink = () => {
  const { goToStepById } = useContext(WizardContextDeprecated);
  const isHypershiftEnabled = useFeatureGate(HYPERSHIFT_WIZARD_FEATURE);
  const accountStepId = getAccountAndRolesStepId(isHypershiftEnabled);
  return (
    <Button variant="link" isInline onClick={() => goToStepById(accountStepId)}>
      Back to associate AWS account
    </Button>
  );
};
