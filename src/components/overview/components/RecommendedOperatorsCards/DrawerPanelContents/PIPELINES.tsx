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
import RedHatOpenShiftPipelinesLogo from '~/styles/images/RedHatOpenShiftPipelinesLogo.svg';

const TITLE = 'Red Hat OpenShift Pipelines';

const PIPELINES_DRAWER_PANEL_CONTENT = {
  head: (
    <Grid hasGutter>
      <GridItem span={2}>
        <img
          src={RedHatOpenShiftPipelinesLogo}
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
            Speed up the delivery of your applications with advanced continuous integration (CI)
            workflows and automation.
          </Text>
          <Text component={TextVariants.p}>
            Built on the open source Tekton framework, Red Hat OpenShift Pipelines provides a
            continuous integration and continuous deployment (CI/CD) experience through tight
            integration with OpenShift and Red Hat developer tools.
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
              <b>React quickly with the market:</b> Continuous integration / continuous deployment
              (CI/CD) allows you to deliver new products and features faster.
            </TextListItem>
            <TextListItem>
              <b>Automate application delivery:</b> Create pipelines of activity from simple,
              repeatable steps.
            </TextListItem>
            <TextListItem>
              <b>Ensure security:</b> Kubernetes role-based access control (RBAC) and security model
              ensures security consistently across pipelines and workloads.
            </TextListItem>
            <TextListItem>
              <b>Adapt to your customers’ needs:</b> You’ll have full control of your application
              lifecycle to support your exact requirements.
            </TextListItem>
          </TextList>
        </TextContent>
      </StackItem>
      <StackItem>
        <Title headingLevel="h3">Platforms</Title>
      </StackItem>
      <StackItem>
        <TextContent>
          <Text component={TextVariants.p}>
            Deploy your applications to multiple platforms, including:
          </Text>
          <TextList>
            {['Kubernetes', 'Serverless', 'Virtual machines'].map((item) => (
              <TextListItem>{item}</TextListItem>
            ))}
          </TextList>
        </TextContent>
      </StackItem>
      <StackItem className="drawer-panel-content__learn-more">
        <ExternalLink
          data-testid="learn-more-about-red-hat-openshift-pipelines-drawer-panel-content-link"
          href="https://catalog.redhat.com/software/container-stacks/detail/5ec54a4628834587a6b85ca5"
        >
          Learn more about Red Hat OpenShift Pipelines
        </ExternalLink>
      </StackItem>
    </Stack>
  ),
};

export default PIPELINES_DRAWER_PANEL_CONTENT;
