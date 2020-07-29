import React from 'react';
import PropTypes from 'prop-types';
import { Button, ClipboardCopy } from '@patternfly/react-core';
import TelemetryDisclaimer from './TelemetryDisclaimer';
import instructionsMapping from '../instructionsMapping';

import { trackPendo } from '../../../../../common/helpers';

const additionalInstructions = (cloudProvider) => {
  if (
    cloudProvider === instructionsMapping.aws.cloudProvider
      || cloudProvider === instructionsMapping.azure.cloudProvider
      || cloudProvider === instructionsMapping.gcp.cloudProvider
  ) {
    return `The installer will ask you for the domain or subdomain you wish to use (this can be purchased through ${cloudProvider} but it will take some time for the DNS to propogate).`;
  }
  return '';
};

const GetStarted = ({
  docURL, cloudProviderID, cloudProvider, customizations,
}) => (
  <>
    <p>
      The installer will take about 45 minutes to run.
      {' '}
      {
      additionalInstructions(cloudProvider)
      }
    </p>
    <Button
      component="a"
      href={docURL}
      rel="noreferrer noopener"
      target="_blank"
      variant="secondary"
      onClick={() => trackPendo('OCP-Download-OfficialDocumentation', cloudProviderID)}
    >
      Get started
    </Button>
    <div>
      To quickly create a cluster with the default options, run the following command:
      <ClipboardCopy
        id="copy-command"
        isReadOnly
        isCode
      >
        ./openshift-install create cluster
      </ClipboardCopy>
      {customizations
        && (
          <p>
            Refer to the documentation to
            {' '}
            <a
              href={customizations}
            >
        install with customizations
            </a>
      .
          </p>
        )}
    </div>
    <TelemetryDisclaimer />
  </>
);
GetStarted.propTypes = {
  docURL: PropTypes.string.isRequired,
  cloudProviderID: PropTypes.string,
  cloudProvider: PropTypes.string.isRequired,
  customizations: PropTypes.string,
};

export default GetStarted;
