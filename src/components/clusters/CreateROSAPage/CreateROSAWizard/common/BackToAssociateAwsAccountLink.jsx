import React, { useContext } from 'react';
import { Button, WizardContext } from '@patternfly/react-core';
import { stepId } from '~/components/clusters/CreateROSAPage/CreateROSAWizard/rosaWizardConstants';

export const BackToAssociateAwsAccountLink = () => {
  const { goToStepById } = useContext(WizardContext)
  return (
    <Button variant="link" isInline onClick={() => goToStepById(stepId.ACCOUNTS_AND_ROLES)}>
      Back to associate AWS account
    </Button>
  )
}
