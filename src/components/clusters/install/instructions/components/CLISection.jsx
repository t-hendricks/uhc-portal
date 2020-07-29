import React from 'react';
import PropTypes from 'prop-types';
import DownloadAndOSSelection from './DownloadAndOSSelection';
import { downloadButtonModes } from './DownloadButton';

const CLISection = ({ token, cloudProviderID, channel }) => (
  <>
    <p>
      Download the OpenShift command-line tools and add them to your
      {' '}
      <code>PATH</code>
      .
    </p>
    <div>
      <DownloadAndOSSelection
        token={token}
        cloudProviderID={cloudProviderID}
        channel={channel}
        mode={downloadButtonModes.CLI_TOOLS}
      />
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
  cloudProviderID: PropTypes.string,
  token: PropTypes.object.isRequired,
  channel: PropTypes.string.isRequired,
};

export default CLISection;
