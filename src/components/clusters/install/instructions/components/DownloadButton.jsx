import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
} from '@patternfly/react-core';

import { trackPendo } from '../../../../../common/helpers';
import { tools } from '../../../../../common/installLinks';

const texts = {
  [tools.CRC]: 'Download CodeReady Containers',
  [tools.CLI_TOOLS]: 'Download command-line tools',
  [tools.X86INSTALLER]: 'Download installer',
  [tools.IBMZINSTALLER]: 'Download installer',
  [tools.PPCINSTALLER]: 'Download installer',
  [tools.ARMINSTALLER]: 'Download installer',
};

const pendoEvents = {
  [tools.CLI_TOOLS]: 'OCP-Download-CLITools',
  [tools.CRC]: 'OCP-Download-CRC',
  [tools.HELM]: 'Download-HELM-CLI',
  [tools.X86INSTALLER]: 'OCP-Download-X86Installer',
  [tools.IMBZINSTALLER]: 'OCP-Download-IBMZInstaller',
  [tools.PPCINSTALLER]: 'OCP-Download-PPCInstaller',
  [tools.ARMINSTALLER]: 'OCP-Download-ARMInstaller',
  [tools.OCM]: 'Download-OCM-CLI',
  [tools.ODO]: 'Download-ODO-CLI',
  [tools.RHOAS]: 'Download-RHOAS-CLI',
  [tools.ROSA]: 'Download-ROSA-CLI',
};

const DownloadButton = ({
  url,
  disabled = false,
  download = true,
  tool = tools.X86INSTALLER,
  pendoID,
  text = '',
  name = '',
}) => {
  const buttonText = text || texts[tool];
  const event = name || pendoEvents[tool];
  const downloadProps = download ? (
    { download: true }
  ) : (
    { rel: 'noreferrer noopener', target: '_blank' }
  );

  return (
    <Button
      component="a"
      href={url}
      variant="secondary"
      className={`download-button tool-${tool.toLowerCase()}`}
      onClick={() => {
        trackPendo(event, pendoID);
      }}
      disabled={!url || disabled}
      {...downloadProps}
    >
      {buttonText}
    </Button>
  );
};
DownloadButton.propTypes = {
  pendoID: PropTypes.string,
  url: PropTypes.string,
  disabled: PropTypes.bool,
  download: PropTypes.bool,
  tool: PropTypes.oneOf(Object.keys(tools)),
  text: PropTypes.string,
  name: PropTypes.string,
};

export default DownloadButton;
