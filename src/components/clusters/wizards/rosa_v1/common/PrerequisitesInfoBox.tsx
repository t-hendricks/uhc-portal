import React, { useContext, useCallback } from 'react';
import { Hint, HintBody, HintTitle } from '@patternfly/react-core';
import { Link } from 'react-router-dom-v5-compat';
import { productName } from '~/components/clusters/wizards/rosa_v1/CreateRosaGetStarted/CreateRosaGetStarted';
import { ROSA_HOSTED_CLI_MIN_VERSION } from '~/components/clusters/wizards/rosa_v1/rosaConstants';
import { ROSAWizardContext } from '~/components/clusters/wizards/rosa_v1/ROSAWizardContext';

interface PrerequisitesInfoBoxProps {
  showRosaCliRequirement?: boolean;
}
export const PrerequisitesInfoBox: React.FC<PrerequisitesInfoBoxProps> = (props) => {
  const { showRosaCliRequirement = true } = props;
  const { setForceLeaveWizard } = useContext(ROSAWizardContext);

  const onClick = useCallback(() => {
    setForceLeaveWizard(true);
  }, [setForceLeaveWizard]);

  return (
    <Hint>
      <HintTitle>
        <strong>Did you complete your prerequisites?</strong>
      </HintTitle>
      <HintBody>
        <p>
          To create a {productName} (ROSA) cluster via the web interface, you must complete the
          prerequisite steps on the{' '}
          <Link to="getstarted" onClick={onClick}>
            Set up ROSA page
          </Link>
          .
        </p>
        {showRosaCliRequirement && (
          <p>
            Make sure you are using ROSA CLI version {ROSA_HOSTED_CLI_MIN_VERSION} or above for
            &quot;Hosted&quot; control plane.
          </p>
        )}
      </HintBody>
    </Hint>
  );
};
