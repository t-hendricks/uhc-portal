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
  RHCOS: 'RHCOS',
};

const DownloadButton = ({
  token,
  url,
  disabled = false,
  mode = downloadButtonModes.INSTALLER,
  pendoID,
  text = '',
  name = '',
}) => {
  let buttonText;
  // eslint-disable-next-line default-case
  switch (mode) {
    case (downloadButtonModes.CRC):
      buttonText = 'Download CodeReady Containers';
      break;
    case (downloadButtonModes.CLI_TOOLS):
      buttonText = 'Download command-line tools';
      break;
    case (downloadButtonModes.INSTALLER):
      buttonText = 'Download installer';
      break;
    case (downloadButtonModes.RHCOS):
      buttonText = text;
      break;
  }

  return (
    <Button
      component="a"
      href={url}
      variant="secondary"
      className="install--download-installer"
      onClick={() => {
        // eslint-disable-next-line default-case
        switch (mode) {
          case (downloadButtonModes.CRC):
            trackPendo('OCP-Download-CRC', pendoID);
            break;
          case (downloadButtonModes.CLI_TOOLS):
            trackPendo('OCP-Download-CLITools', pendoID);
            break;
          case (downloadButtonModes.INSTALLER):
            trackPendo('OCP-Download-Installer', pendoID);
            break;
          case (downloadButtonModes.RHCOS):
            trackPendo(name, pendoID);
            break;
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
  pendoID: PropTypes.string,
  url: PropTypes.string,
  disabled: PropTypes.bool,
  mode: PropTypes.oneOf(['CLI_TOOLS', 'CRC', 'INSTALLER', 'RHCOS']),
  text: PropTypes.string,
  name: PropTypes.string,
};

export default DownloadButton;
