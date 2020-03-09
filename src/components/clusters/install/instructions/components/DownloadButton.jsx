import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
} from '@patternfly/react-core';


import { trackPendo } from '../../../../../common/helpers';

const DownloadButton = ({ token, installerURL, cloudProviderID }) => (

  <Button
    component="a"
    href={installerURL}
    target="_blank"
    variant="secondary"
    className="install--download-installer"
    disabled={!!token.error}
    onClick={() => trackPendo('Download-Installer', cloudProviderID)}
  >
    Download installer
  </Button>
);
DownloadButton.propTypes = {
  token: PropTypes.object.isRequired,
  installerURL: PropTypes.string,
  cloudProviderID: PropTypes.string,
};

export default DownloadButton;
