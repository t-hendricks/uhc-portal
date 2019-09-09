import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
} from '@patternfly/react-core';

const GetStarted = ({ docURL }) => (
  <React.Fragment>
    <p>
      Follow the
      {' '}
      <a href={docURL} target="_blank">
        official documentation
        {' '}
        <span className="fa fa-external-link" aria-hidden="true" />
      </a>
      {' '}
      for detailed installation instructions.
    </p>
    <Button component="a" href={docURL} target="_blank" variant="secondary">
      Get started
    </Button>
    <p />
    <p>
      Relevant downloads are provided below.
    </p>
  </React.Fragment>
);
GetStarted.propTypes = {
  docURL: PropTypes.string.isRequired,
};

export default GetStarted;
