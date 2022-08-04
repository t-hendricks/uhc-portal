import React from 'react';
import PropTypes from 'prop-types';
import { EmptyState, EmptyStateBody } from '@patternfly/react-core';
import { InvalidObject } from '@redhat-cloud-services/frontend-components/InvalidObject';
import './NotFoundError.scss';

function NotFoundError() {
  return (
    <EmptyState id="not-found">
      <EmptyStateBody>
        <InvalidObject />
      </EmptyStateBody>
    </EmptyState>
  );
}

NotFoundError.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

export default NotFoundError;
