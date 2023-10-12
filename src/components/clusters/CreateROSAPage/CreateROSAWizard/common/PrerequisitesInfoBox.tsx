import React from 'react';
import { Hint, HintBody, HintFooter, HintTitle } from '@patternfly/react-core';
import { Link } from 'react-router-dom';
import { productName } from '~/components/clusters/CreateROSAPage/CreateROSAWizard/CreateRosaGetStarted/CreateRosaGetStarted';

export const PrerequisitesInfoBox: React.FC = () => (
  <Hint>
    <HintTitle>
      <strong>Did you complete your prerequisites?</strong>
    </HintTitle>
    <HintBody>
      To use the web interface to create a ROSA cluster you will need to have already completed the
      prerequisite steps on the
    </HintBody>
    <HintFooter>
      <Link to="getstarted">{`Get started with ${productName} (ROSA) page.`}</Link>
    </HintFooter>
  </Hint>
);
