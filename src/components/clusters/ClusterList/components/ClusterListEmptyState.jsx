// ClusterListEmptyState is the empty state (no clusters) for ClusterList
import React from 'react';
import { Link } from 'react-router-dom';
import {
  EmptyState,
  EmptyStateVariant,
  EmptyStateIcon,
  Title,
  EmptyStateBody,
  Button,
} from '@patternfly/react-core';
import { OpenshiftIcon } from '@patternfly/react-icons';


function ClusterListEmptyState() {
  return (
    <EmptyState variant={EmptyStateVariant.large}>
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
        <Button>Create Cluster</Button>
      </Link>
    </EmptyState>
  );
}

export default ClusterListEmptyState;
