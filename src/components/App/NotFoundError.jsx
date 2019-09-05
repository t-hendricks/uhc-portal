import React from 'react';
import PropTypes from 'prop-types';
import { Alert, EmptyState } from '@patternfly/react-core';
import { Link } from 'react-router-dom';

import getBaseName from '../../common/getBaseName';

function NotFoundError({ location }) {
  const locationWithPrefix = `${getBaseName()}${location.pathname}`;
  return (
    <EmptyState>
      <Alert variant="danger" isInline title="Not Found">
        The URL&nbsp;
        {locationWithPrefix}
        &nbsp;was not found in this application.
        <br />
        <Link to="/">
          Go back to the main page
        </Link>
      </Alert>
    </EmptyState>
  );
}

NotFoundError.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

export default NotFoundError;
