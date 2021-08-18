import React from 'react';
import {
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Title,
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';

import ExternalLink from '../../../common/ExternalLink';

const EmptyRemediationInfo = () => (
  <EmptyState className="empty-table-message" variant={EmptyStateVariant.large}>
    <EmptyStateIcon className="danger-color" icon={ExclamationCircleIcon} />
    <Title headingLevel="h5" size="lg">
      There was an error fetching the data.
    </Title>
    <EmptyStateBody>
      Try refreshing the page. If the bug persists, please,
      {' '}
      <ExternalLink href="https://bugzilla.redhat.com/enter_bug.cgi?product=Red%20Hat%20Hybrid%20Cloud%20Console%20%28console.redhat.com%29&component=Insights%20-%20OpenShift%20Integration&priority=urgent">
        let us know
      </ExternalLink>
      .
    </EmptyStateBody>
  </EmptyState>
);

export default EmptyRemediationInfo;
