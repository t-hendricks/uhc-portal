import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
} from '@patternfly/react-core';

import { trackPendo } from '../../../../../common/helpers';

export const downloadButtonModes = {
  CLI_TOOLS: 'CLI_TOOLS',
  CRC: 'CRC',
  INSTALLER: 'INSTALLER',
};

const DownloadButton = ({
  token,
  url,
  disabled = false,
  mode = downloadButtonModes.INSTALLER,
  cloudProviderID,
}) => {
  let buttonText;
  switch (mode) {
    case (downloadButtonModes.CRC):
      buttonText = 'Download Code-Ready Containers';
      break;
    case (downloadButtonModes.CLI_TOOLS):
      buttonText = 'Download command-line tools';
      break;
    default:
      buttonText = 'Download installer';
  }

  return (
    <Button
      component="a"
      href={url}
      variant="secondary"
      className="install--download-installer"
      onClick={() => {
        switch (mode) {
          case (downloadButtonModes.CRC):
            trackPendo('OCP-Download-CRC', cloudProviderID);
            break;
          case (downloadButtonModes.CLI_TOOLS):
            trackPendo('OCP-Download-CLITools', cloudProviderID);
            break;
          default:
            trackPendo('OCP-Download-Installer', cloudProviderID);
        }
      }}
      disabled={!!token.error || disabled}
      download
    >
      {buttonText}
    </Button>
  );
};
DownloadButton.propTypes = {
  token: PropTypes.object.isRequired,
  cloudProviderID: PropTypes.string,
  url: PropTypes.string,
  disabled: PropTypes.bool,
  mode: PropTypes.oneOf(['CLI_TOOLS', 'CRC', 'INSTALLER']),
};

export default DownloadButton;
