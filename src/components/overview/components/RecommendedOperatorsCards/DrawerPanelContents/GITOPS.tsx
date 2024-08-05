import React from 'react';

import {
  Grid,
  GridItem,
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
import RedHatOpenShiftGitOpsLogo from '~/styles/images/RedHatOpenShiftGitOpsLogo.svg';

const TITLE = 'Red Hat OpenShift GitOps';

const GITOPS_DRAWER_PANEL_CONTENT = {
  head: (
    <Grid hasGutter>
      <GridItem span={2}>
        <img
          src={RedHatOpenShiftGitOpsLogo}
          alt={`${TITLE} logo`}
          className="drawer-panel-content__logo"
        />
      </GridItem>
      <GridItem span={10}>
        <Title headingLevel="h2" data-testid="drawer-panel-content__title">
          {TITLE}
        </Title>
        <Text component={TextVariants.small}>by Red Hat</Text>
      </GridItem>
    </Grid>
  ),
  body: (
    <Stack hasGutter className="drawer-panel-content-body">
      <StackItem>
        <TextContent>
          <Text component={TextVariants.p}>
            Consistently configure and deploy Kubernetes-based infrastructure and applications
            across clusters and development lifecycles using Red Hat OpenShift GitOps.
          </Text>
          <Text component={TextVariants.p}>
            Red Hat OpenShift GitOps uses the open source project{' '}
            <Text
              component={TextVariants.a}
              href="https://www.redhat.com/en/blog/argocd-and-gitops-whats-next"
            >
              Argo CD
            </Text>{' '}
            as the declarative GitOps engine.
          </Text>
        </TextContent>
      </StackItem>
      <StackItem>
        <Title headingLevel="h3">Benefits</Title>
      </StackItem>
      <StackItem>
        <TextContent>
          <TextList isPlain>
            <TextListItem>
              <b>Enhance traceability and visibility:</b> Infrastructure and applications are stored
              and versioned in Git.
            </TextListItem>
            <TextListItem>
              <b>Ensure consistency:</b> Red Hat OpenShift GitOps makes the configuration
              repositories the central element and ensures consistency in applications when you
              deploy them to different clusters in different environments, such as development,
              staging, and production.
            </TextListItem>
            <TextListItem>
              <b>Automate infrastructure and deployment requirements:</b> Updates and changes are
              pushed through declarative code across environments.
            </TextListItem>
          </TextList>
        </TextContent>
      </StackItem>
      <StackItem className="drawer-panel-content__learn-more">
        <ExternalLink
          data-testid="learn-more-about-red-hat-openshift-gitops-drawer-panel-content-link"
          href="https://catalog.redhat.com/software/container-stacks/detail/5fb288c70a12d20cbecc6056"
        >
          Learn more about Red Hat OpenShift GitOps
        </ExternalLink>
      </StackItem>
    </Stack>
  ),
};

export default GITOPS_DRAWER_PANEL_CONTENT;
