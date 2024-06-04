import React from 'react';

import {
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateHeader,
  EmptyStateIcon,
  EmptyStateVariant,
} from '@patternfly/react-core';

import links from '../../../common/installLinks.mjs';
import ExternalLink from '../../common/ExternalLink';

import CostIcon from './CostIcon';

const CostEmptyState = () => (
  <EmptyState variant={EmptyStateVariant.lg} className="pf-m-redhat-font">
    <EmptyStateHeader
      titleText="Track your OpenShift spending!"
      icon={<EmptyStateIcon icon={CostIcon} />}
      headingLevel="h2"
    />
    <EmptyStateBody>
      Add an OpenShift Container Platform cluster to see a total cost breakdown of your pods by
      cluster, node, project, or labels.
    </EmptyStateBody>
    <EmptyStateFooter>
      <EmptyStateActions>
        <ExternalLink href={links.COSTMGMT_ADDING_OCP}>
          Add an OpenShift cluster to Cost Management
        </ExternalLink>
      </EmptyStateActions>
    </EmptyStateFooter>
  </EmptyState>
);

export default CostEmptyState;
