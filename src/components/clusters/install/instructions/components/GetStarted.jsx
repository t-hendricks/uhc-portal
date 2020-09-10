import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Button, ClipboardCopy } from '@patternfly/react-core';
import TelemetryDisclaimer from './TelemetryDisclaimer';
import instructionsMapping from '../instructionsMapping';
import { trackPendo } from '../../../../../common/helpers';

const GetStarted = ({
  docURL, pendoID, cloudProviderID, customizations,
}) => (
  <>
    <p>
      The installer will take about 45 minutes to run.
      {' '}
      {
        get(instructionsMapping, `${cloudProviderID}.getStartedAdditional`, null) || ''
      }
    </p>
    <Button
      component="a"
      href={docURL}
      rel="noreferrer noopener"
      target="_blank"
      variant="secondary"
      onClick={() => trackPendo('OCP-Download-OfficialDocumentation', pendoID)}
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
  pendoID: PropTypes.string,
  cloudProviderID: PropTypes.string.isRequired,
  customizations: PropTypes.string,
};

export default GetStarted;
