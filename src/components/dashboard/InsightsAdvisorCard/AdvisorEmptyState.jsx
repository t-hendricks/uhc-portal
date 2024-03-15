import React from 'react';
import { SearchIcon } from '@patternfly/react-icons/dist/esm/icons/search-icon';
import {
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateHeader,
} from '@patternfly/react-core';

import links from '../../../common/installLinks.mjs';
import ExternalLink from '../../common/ExternalLink';

const AdvisorEmptyState = () => (
  <EmptyState isFullHeight className="ocm-insights--advisor-empty-state">
    <EmptyStateHeader
      titleText="No Advisor recommendations"
      icon={<EmptyStateIcon icon={SearchIcon} />}
      headingLevel="h4"
    />
    <EmptyStateBody>
      This feature uses the Remote Health functionality of OpenShift Container Platform. For further
      details about Insights, see the{' '}
      <ExternalLink href={links.REMOTE_HEALTH_INSIGHTS}>OpenShift documentation</ExternalLink>.
    </EmptyStateBody>
  </EmptyState>
);

export default AdvisorEmptyState;
