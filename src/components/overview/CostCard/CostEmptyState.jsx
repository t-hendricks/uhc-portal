import React from 'react';
import {
  EmptyState, EmptyStateBody, EmptyStateSecondaryActions, EmptyStateIcon, EmptyStateVariant, Title,
} from '@patternfly/react-core';
import CostIcon from './CostIcon';
import ExternalLink from '../../common/ExternalLink';
import links from '../../../common/installLinks.mjs';

const CostEmptyState = () => (
  <EmptyState variant={EmptyStateVariant.large} className="pf-m-redhat-font">
    <EmptyStateIcon icon={CostIcon} />
    <Title headingLevel="h2" size="lg">
      Track your OpenShift spending!
    </Title>
    <EmptyStateBody>
      Add an OpenShift Container Platform cluster to see a total cost breakdown of
      your pods by cluster, node, project, or labels.
    </EmptyStateBody>
    <EmptyStateSecondaryActions>
      <ExternalLink href={links.COSTMGMT_ADDING_OCP}>
        Add an OpenShift cluster to Cost Management
      </ExternalLink>
    </EmptyStateSecondaryActions>
  </EmptyState>
);

export default CostEmptyState;
