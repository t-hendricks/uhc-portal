import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
} from '@patternfly/react-core';

const CLISection = ({ toolsURL }) => (
  <>
    <p>
      Download the OpenShift command-line tools and add them to your
      {' '}
      <code>PATH</code>
      .
    </p>
    <div>
      <a href={toolsURL} target="_blank">
        <Button
          variant="secondary"
          className="install--download-cli"
          tabIndex="-1"
        >
          Download command-line tools
        </Button>
      </a>
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
};

export default CLISection;
