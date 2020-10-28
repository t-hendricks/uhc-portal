import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Button, ClipboardCopy } from '@patternfly/react-core';
import TelemetryDisclaimer from './TelemetryDisclaimer';
import instructionsMapping from '../instructionsMapping';
import { trackPendo } from '../../../../../common/helpers';

const GetStarted = ({
  docURL, pendoID, cloudProviderID, customizations, isBMIPI,
}) => (
  <>
    <p>
      The installer will take about 45 minutes to run.
      {' '}
      {
        get(instructionsMapping, `${cloudProviderID}.getStartedAdditional`, null) || ''
      }
      {
        isBMIPI && (
          <p>
      When the installer is complete you will see the console URL and credentials for
      accessing your new cluster. A
            {' '}
            <code>kubeconfig</code>
            {' '}
      file will also be generated for you to use with the
            {' '}
            <code>oc</code>
            {' '}
      CLI tools you downloaded.
          </p>
        )
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
      { !isBMIPI && (
        <>
      To quickly create a cluster with the default options, run the following command:
          <ClipboardCopy
            id="copy-command"
            isReadOnly
            isCode
          >
        ./openshift-install create cluster
          </ClipboardCopy>
        </>
      )}
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

GetStarted.defaultProps = {
  isBMIPI: false,
};

GetStarted.propTypes = {
  docURL: PropTypes.string.isRequired,
  pendoID: PropTypes.string,
  cloudProviderID: PropTypes.string.isRequired,
  customizations: PropTypes.string,
  isBMIPI: PropTypes.bool,
};

export default GetStarted;
