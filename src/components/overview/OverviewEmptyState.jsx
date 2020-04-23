import React from 'react';
import { Link } from 'react-router-dom';
import {
  EmptyState,
  EmptyStateVariant,
  EmptyStateIcon,
  Title,
  EmptyStateBody,
  EmptyStateSecondaryActions,
  Button,
} from '@patternfly/react-core';
import { RocketIcon } from '@patternfly/react-icons';

import {
  // eslint-disable-next-line camelcase
  c_empty_state__icon_Color,
} from '@patternfly/react-tokens';

function OverviewEmptyState() {
  return (
    <EmptyState variant={EmptyStateVariant.large} className="cluster-list-empty-state">
      <EmptyStateIcon icon={RocketIcon} color={c_empty_state__icon_Color.value} />
      <Title headingLevel="h4" size="2xl">
        Get started with Openshift
      </Title>
      <EmptyStateBody>
        The Red Hat OpenShift Cluster Manager helps you create,
        register, and manage OpenShift 4 clusters. To get started,
        create your first cluster.
      </EmptyStateBody>
      <Link to="/create">
        <Button id="cluster-list-emptystate-primary-action">Create cluster</Button>
      </Link>
      <EmptyStateSecondaryActions>
        <Link to="/register">
          <Button variant="link">Register cluster</Button>
        </Link>
        <Link to="/archived">
          <Button variant="link">View archived clusters</Button>
        </Link>
      </EmptyStateSecondaryActions>
    </EmptyState>
  );
}

export default OverviewEmptyState;
