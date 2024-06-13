import React from 'react';

import { EmptyState, EmptyStateBody, Spinner } from '@patternfly/react-core';

import { AppPage } from './AppPage';

const LoadingPage = () => (
  <AppPage>
    <EmptyState id="not-found">
      <EmptyStateBody>
        <Spinner />
      </EmptyStateBody>
    </EmptyState>
  </AppPage>
);

export default LoadingPage;
