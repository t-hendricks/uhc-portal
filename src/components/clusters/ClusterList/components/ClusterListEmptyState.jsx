// ClusterListEmptyState is the empty state (no clusters) for ClusterList
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
import { OpenshiftIcon } from '@patternfly/react-icons';


function ClusterListEmptyState() {
  return (
    <EmptyState variant={EmptyStateVariant.large} className="cluster-list-empty-state">
      <EmptyStateIcon icon={OpenshiftIcon} color="#c00" />
      <Title headingLevel="h4" size="2xl">
        No OpenShift clusters to display
      </Title>
      <EmptyStateBody>
        The Red Hat OpenShift Cluster Manager helps you create,
        register, and manage OpenShift 4 clusters. To get started,
        create your first cluster.
      </EmptyStateBody>
      <Link to="/create">
        <Button id="cluster-list-emptystate-primary-action">Create Cluster</Button>
      </Link>
      <EmptyStateSecondaryActions>
        <Link to="/register">
          <Button variant="link">Register disconnected cluster</Button>
        </Link>
        <Link to="/archived">
          <Button variant="link">View archived clusters</Button>
        </Link>
      </EmptyStateSecondaryActions>
    </EmptyState>
  );
}

export default ClusterListEmptyState;
