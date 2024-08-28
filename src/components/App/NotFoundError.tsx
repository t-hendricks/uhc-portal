import React from 'react';

import { EmptyState, EmptyStateBody } from '@patternfly/react-core';
import { InvalidObject } from '@redhat-cloud-services/frontend-components/InvalidObject';

import { AppPage } from './AppPage';

import './NotFoundError.scss';

const NotFoundError = () => (
  <AppPage>
    <EmptyState id="not-found" data-testid="not-found">
      <EmptyStateBody>
        <InvalidObject />
      </EmptyStateBody>
    </EmptyState>
  </AppPage>
);

export default NotFoundError;
