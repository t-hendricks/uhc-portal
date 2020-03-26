import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@patternfly/react-core';


import { trackPendo } from '../../../../../common/helpers';

const CLISection = ({ toolsURL, cloudProviderID }) => (
  <>
    <p>
      Download the OpenShift command-line tools and add them to your
      {' '}
      <code>PATH</code>
      .
    </p>
    <div>
      <Button
        component="a"
        href={toolsURL}
        rel="noreferrer noopener"
        target="_blank"
        variant="secondary"
        className="install--download-cli"
        onClick={() => trackPendo('OCP-Download-CLITools', cloudProviderID)}
      >
        Download command-line tools
      </Button>
    </div>
    <p />
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
  </>
);
CLISection.propTypes = {
  toolsURL: PropTypes.string.isRequired,
  cloudProviderID: PropTypes.string,
};

export default CLISection;
