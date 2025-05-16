import React from 'react';

import {
  Stack,
  StackItem,
  Text,
  TextContent,
  TextList,
  TextListItem,
  TextVariants,
  Title,
} from '@patternfly/react-core';

import ExternalLink from '~/components/common/ExternalLink';
import { YoutubePlayer } from '~/components/common/YoutubePlayer/YoutubePlayer';

const AdvancedClusterManagementDrawerPanelBody = (
  <Stack hasGutter className="drawer-panel-content-body">
    <StackItem>
      <TextContent>
        <Text component={TextVariants.p}>
          Red Hat Advanced Cluster Management for Kubernetes provides visibility of your entire
          Kubernetes fleet with built-in governance and application lifecycle management.
        </Text>
      </TextContent>
    </StackItem>

    <StackItem>
      <YoutubePlayer videoID="iivhwFaDHKg" />
      <TextContent>
        <Text component={TextVariants.small}>Video duration 1:57</Text>
      </TextContent>
    </StackItem>

    <StackItem>
      <Title headingLevel="h3" data-testid="drawer-panel-content-benefits-title">
        Benefits
      </Title>
    </StackItem>
    <StackItem>
      <TextContent>
        <TextList isPlain>
          <TextListItem>
            <strong>Reduce operational costs for multicloud environments:</strong> It takes a lot of
            manual effort to manage multiple Kubernetes clusters running across multiple clouds.
            Each cluster has to be individually deployed, upgraded, and configured for security,
            increasing operational costs as organizations add more clusters. Bringing all of the
            clusters into a single management environment reduces operational cost, makes the
            environment consistent, and removes the need to manually manage individual clusters.
          </TextListItem>
          <TextListItem>
            <strong>Accelerate software development:</strong> Development teams want to focus on
            building software, not implementation details. Self-service provisioning of
            preconfigured resources to any environment with Red Hat Advanced Cluster Management
            frees developers to deliver software.
          </TextListItem>
          <TextListItem>
            <strong>Increase application availability:</strong> Applications can be deployed to
            various clusters and locations using placement rules for availability or capacity
            reasons. If a cluster becomes unavailable, Red Hat Advanced Cluster Management will
            automatically deploy the application to a cluster that matches the placement rules.
          </TextListItem>
          <TextListItem>
            <strong>Simplify IT operations:</strong> IT departments can enable self-service
            capabilities, allowing departments to request clusters from a catalog. Those clusters
            automatically become manageable by Red Hat Advanced Cluster Management. As a result,
            central IT is no longer an impediment in delivering environments to the applications
            teams.
          </TextListItem>
          <TextListItem>
            <strong>More easily meet governance requirements:</strong> Governance policies can be
            written and enforced consistently in each environment.
          </TextListItem>
        </TextList>
      </TextContent>
    </StackItem>

    <StackItem className="drawer-panel-content__learn-more">
      <ExternalLink
        data-testid="learn-more-about-advanced-cluster-management-drawer-panel-content-link"
        href="https://www.redhat.com/en/technologies/management/advanced-cluster-management"
      >
        Learn more about Advanced Cluster Management for Kubernetes
      </ExternalLink>
    </StackItem>
  </Stack>
);

export { AdvancedClusterManagementDrawerPanelBody };
