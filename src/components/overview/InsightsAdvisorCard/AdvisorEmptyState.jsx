import React from 'react';
import { SearchIcon } from '@patternfly/react-icons';
import {
  EmptyState, EmptyStateBody, EmptyStateIcon, Title,
} from '@patternfly/react-core';

import links from '../../../common/installLinks';
import ExternalLink from '../../common/ExternalLink';

const AdvisorEmptyState = () => (
  <EmptyState isFullHeight className="ocm-insights--advisor-empty-state">
    <EmptyStateIcon icon={SearchIcon} />
    <Title size="lg" headingLevel="h4">
      No Advisor recommendations
    </Title>
    <EmptyStateBody>
      This feature uses the Remote Health functionality of
      OpenShift Container Platform. For further details about Insights, see the
      {' '}
      <ExternalLink href={links.REMOTE_HEALTH_INSIGHTS}>
        OpenShift documentation
      </ExternalLink>
      .
    </EmptyStateBody>
  </EmptyState>
);

export default AdvisorEmptyState;
