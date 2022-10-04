import React from 'react';
import { Button, WizardContextConsumer } from '@patternfly/react-core';
import { stepId } from '~/components/clusters/CreateROSAPage/CreateROSAWizard/rosaWizardConstants';

export const BackToAssociateAwsAccountLink = () => <>
  <WizardContextConsumer>
    {({ goToStepById }) => (
      <Button variant="link" isInline onClick={()=>goToStepById(stepId.ACCOUNTS_AND_ROLES)}>
        Back to associate AWS account
      </Button>
    )}
  </WizardContextConsumer>
</>
