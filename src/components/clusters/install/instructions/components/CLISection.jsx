import React from 'react';
import {
  Text,
} from '@patternfly/react-core';

import PropTypes from 'prop-types';
import DownloadAndOSSelection from './DownloadAndOSSelection';
import { tools, channels, architectures } from '../../../../../common/installLinks';

const CLISection = ({
  token, pendoID, channel, architecture, isBMIPI = false,
}) => (
  <>
    <Text component="p">
      Download the OpenShift command-line tools and add them to your
      {' '}
      <code>PATH</code>
      .
    </Text>
    <div>
      <DownloadAndOSSelection
        token={token}
        pendoID={pendoID}
        tool={tools.CLI_TOOLS}
        channel={channel}
        architecture={architecture}
      />
    </div>
    <Text component="p" />
    {!isBMIPI && (
      <Text component="p">
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
      </Text>
    )}
  </>
);
CLISection.propTypes = {
  pendoID: PropTypes.string,
  token: PropTypes.object.isRequired,
  channel: PropTypes.oneOf(Object.values(channels)).isRequired,
  architecture: PropTypes.oneOf(Object.values(architectures)).isRequired,
  isBMIPI: PropTypes.bool,
};

export default CLISection;
