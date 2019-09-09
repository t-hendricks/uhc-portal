import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
} from '@patternfly/react-core';

const DownloadButton = ({ token, installerURL }) => (
  <Button
    component="a"
    href={installerURL}
    target="_blank"
    variant="secondary"
    className="install--download-installer"
    disabled={!!token.error}
    tabIndex="-1"
  >
    Download installer
  </Button>
);
DownloadButton.propTypes = {
  token: PropTypes.object.isRequired,
  installerURL: PropTypes.string.isRequired,
};

export default DownloadButton;
