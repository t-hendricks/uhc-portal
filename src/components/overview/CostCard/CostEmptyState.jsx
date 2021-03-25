import React from 'react';
import {
  EmptyState, EmptyStateBody, EmptyStateSecondaryActions, EmptyStateIcon, EmptyStateVariant, Title,
} from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons/dist/js/icons/external-link-alt-icon';
import CostIcon from './CostIcon';

const DOC_URL = 'https://access.redhat.com/documentation/en-us/cost_management_service/2021/html/getting_started_with_cost_management/assembly-adding-openshift-container-platform-source';

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
      <a href={DOC_URL} rel="noopener noreferrer" target="_blank">
        Add an OpenShift cluster to Cost Management
        {' '}
        <ExternalLinkAltIcon />
      </a>
    </EmptyStateSecondaryActions>
  </EmptyState>
);

export default CostEmptyState;
