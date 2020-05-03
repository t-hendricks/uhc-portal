import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
} from '@patternfly/react-core';

import { trackPendo } from '../../../../../common/helpers';

const DownloadButton = ({
  token,
  url,
  disabled = false,
  cliTools = false,
  cloudProviderID,
}) => (
  <Button
    component="a"
    href={url}
    variant="secondary"
    className="install--download-installer"
    onClick={() => {
      if (cliTools) {
        trackPendo('OCP-Download-CLITools', cloudProviderID);
      } else {
        trackPendo('OCP-Download-Installer', cloudProviderID);
      }
    }}
    disabled={!!token.error || disabled}
    download
  >
    {cliTools ? 'Download command-line tools' : 'Download installer'}
  </Button>
);
DownloadButton.propTypes = {
  token: PropTypes.object.isRequired,
  cloudProviderID: PropTypes.string,
  url: PropTypes.string,
  disabled: PropTypes.bool,
  cliTools: PropTypes.bool,
};

export default DownloadButton;
