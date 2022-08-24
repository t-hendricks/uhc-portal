import React from 'react';
import { EmptyState, EmptyStateBody } from '@patternfly/react-core';
import { InvalidObject } from '@redhat-cloud-services/frontend-components/InvalidObject';
import './NotFoundError.scss';

const NotFoundError = () => (
  <EmptyState id="not-found">
    <EmptyStateBody>
      <InvalidObject />
    </EmptyStateBody>
  </EmptyState>
);

export default NotFoundError;
