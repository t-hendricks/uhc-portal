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
import { PlusCircleIcon } from '@patternfly/react-icons';

import { ASSISTED_INSTALLER_FEATURE } from '../../../../redux/constants/featureConstants';
import withFeatureGate from '../../../features/with-feature-gate';

const AssistedInstallerLink = withFeatureGate(
  () => (
    <Link to="/assisted-installer">
      <Button variant="link">Assisted Installer clusters</Button>
    </Link>
  ),
  ASSISTED_INSTALLER_FEATURE,
  () => false,
);

function ClusterListEmptyState() {
  return (
    <EmptyState variant={EmptyStateVariant.large} className="cluster-list-empty-state">
      <EmptyStateIcon icon={PlusCircleIcon} />
      <Title headingLevel="h4" size="2xl">
        Let&#39;s create your first cluster
      </Title>
      <EmptyStateBody>
        You don&#39;t have any clusters yet, but you can easily create or register your first
        OpenShift 4 cluster.
      </EmptyStateBody>
      <Link to="/create">
        <Button data-testid="create_cluster_btn" className="pf-u-mt-xl">
          Create cluster
        </Button>
      </Link>
      <EmptyStateSecondaryActions>
        <Link to="/register">
          <Button variant="link">Register cluster</Button>
        </Link>
        <Link to="/archived">
          <Button variant="link">View cluster archives</Button>
        </Link>
        <AssistedInstallerLink />
      </EmptyStateSecondaryActions>
    </EmptyState>
  );
}

export default ClusterListEmptyState;
