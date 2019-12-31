import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';

import links from '../../../../../../common/installLinks';

const RHCOSSection = ({ learnMoreURL, token, downloadURL = links.DOWNLOAD_RHCOS_LATEST }) => (
  <>
    {learnMoreURL && (
      <p>
        Download RHCOS to create machines for your cluster to use during installation.
        {' '}
        <a href={learnMoreURL} target="_blank">
          Learn more
          {' '}
          <ExternalLinkAltIcon color="#0066cc" size="sm" />
          .
        </a>
      </p>
    )}
    <p>
      <a href={downloadURL} target="_blank">
        <Button
          variant="secondary"
          className="install--download-installer"
          disabled={!!token.error}
          tabIndex="-1"
        >
          Download RHCOS
        </Button>
      </a>
    </p>
  </>
);
RHCOSSection.propTypes = {
  learnMoreURL: PropTypes.string,
  downloadURL: PropTypes.string,
  token: PropTypes.object.isRequired,
};

export default RHCOSSection;
