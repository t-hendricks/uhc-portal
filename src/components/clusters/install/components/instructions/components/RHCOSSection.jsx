import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
} from '@patternfly/react-core';


const RHCOSSection = ({ learnMoreURL, token }) => (
  <React.Fragment>
    <p>
      Download RHCOS to create machines for your cluster to use during installation.
      {' '}
      <a href={learnMoreURL} target="_blank">
        Learn more
        {' '}
        <span className="fa fa-external-link" aria-hidden="true" />
        .
      </a>
    </p>
    <p>
      <a href="https://mirror.openshift.com/pub/openshift-v4/dependencies/rhcos/4.2/latest/" target="_blank">
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
  </React.Fragment>
);
RHCOSSection.propTypes = {
  learnMoreURL: PropTypes.string.isRequired,
  token: PropTypes.object.isRequired,
};

export default RHCOSSection;
