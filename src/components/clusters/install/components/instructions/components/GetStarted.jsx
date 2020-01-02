import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';

const GetStarted = ({ docURL }) => (
  <>
    <p>
      Follow the
      {' '}
      <a href={docURL} rel="noreferrer noopener" target="_blank">
        official documentation
        {' '}
        <ExternalLinkAltIcon color="#0066cc" size="sm" />
      </a>
      {' '}
      for detailed installation instructions.
    </p>
    <Button component="a" href={docURL} rel="noreferrer noopener" target="_blank" variant="secondary">
      Get started
    </Button>
    <p />
    <p>
      Relevant downloads are provided below.
    </p>
  </>
);
GetStarted.propTypes = {
  docURL: PropTypes.string.isRequired,
};

export default GetStarted;
