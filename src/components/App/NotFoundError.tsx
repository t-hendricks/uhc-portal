import React from 'react';
import { EmptyState, EmptyStateBody } from '@patternfly/react-core';
import { InvalidObject } from '@redhat-cloud-services/frontend-components/InvalidObject';
import './NotFoundError.scss';
import { AppPage } from './AppPage';

const NotFoundError = () => (
  <AppPage>
    <EmptyState id="not-found">
      <EmptyStateBody>
        <InvalidObject />
      </EmptyStateBody>
    </EmptyState>
  </AppPage>
);

export default NotFoundError;
