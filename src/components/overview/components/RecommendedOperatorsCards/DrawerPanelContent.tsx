import React, { ReactNode } from 'react';

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

import RedHatOpenShiftGitOpsLogo from '../../../../styles/images/RedHatOpenShiftGitOpsLogo.svg';
import RedHatOpenShiftPipelinesLogo from '../../../../styles/images/RedHatOpenShiftPipelinesLogo.svg';
import RedHatOpenShiftServiceMeshLogo from '../../../../styles/images/RedHatOpenShiftServiceMeshLogo.svg';

import './DrawerPanelContent.scss';

type DrawerPanelContentNode = {
  head?: ReactNode;
  body: ReactNode;
};

const PRODUCT_CARD_LOGOS = {
  gitops: {
    title: 'Red Hat OpenShift GitOps',
    logo: RedHatOpenShiftGitOpsLogo,
  },
  pipelines: {
    title: 'Red Hat OpenShift Pipelines',
    logo: RedHatOpenShiftPipelinesLogo,
  },
  serviceMesh: {
    title: 'Red Hat OpenShift Service Mesh',
    logo: RedHatOpenShiftServiceMeshLogo,
  },
};

const getLogoElement = (logoObj: { title: string; logo: string }) => (
  <img src={logoObj.logo} alt={`${logoObj.title} logo`} className="drawer-panel-content__logo" />
);

const DRAWER_PANEL_CONTENT = {
  gitops: {
    head: (
      <Grid hasGutter>
        <GridItem span={2}>{getLogoElement(PRODUCT_CARD_LOGOS.gitops)}</GridItem>
        <GridItem span={10}>
          <Title headingLevel="h2" data-testid="drawer-panel-content__title">
            {PRODUCT_CARD_LOGOS.gitops.title}
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
                <b>Enhance traceability and visibility:</b> Infrastructure and applications are
                stored and versioned in Git.
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
        <StackItem>
          <ExternalLink
            data-testid="learn-more-about-red-hat-openshift-gitops-drawer-panel-content-link"
            href="https://catalog.redhat.com/software/container-stacks/detail/5fb288c70a12d20cbecc6056"
          >
            Learn more about Red Hat OpenShift GitOps
          </ExternalLink>
        </StackItem>
      </Stack>
    ),
  },
  pipelines: {
    head: (
      <Grid hasGutter>
        <GridItem span={2}>{getLogoElement(PRODUCT_CARD_LOGOS.pipelines)}</GridItem>
        <GridItem span={10}>
          <Title headingLevel="h2" data-testid="drawer-panel-content__title">
            {PRODUCT_CARD_LOGOS.pipelines.title}
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
                <b>Ensure security:</b> Kubernetes role-based access control (RBAC) and security
                model ensures security consistently across pipelines and workloads
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
        <StackItem>
          <ExternalLink
            data-testid="learn-more-about-red-hat-openshift-pipelines-drawer-panel-content-link"
            href="https://catalog.redhat.com/software/container-stacks/detail/5ec54a4628834587a6b85ca5"
          >
            Learn more about Red Hat OpenShift Pipelines
          </ExternalLink>
        </StackItem>
      </Stack>
    ),
  },
  serviceMesh: {
    head: (
      <Grid hasGutter>
        <GridItem span={2}>{getLogoElement(PRODUCT_CARD_LOGOS.serviceMesh)}</GridItem>
        <GridItem span={10}>
          <Title headingLevel="h2" data-testid="drawer-panel-content__title">
            {PRODUCT_CARD_LOGOS.serviceMesh.title}
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
              Connect, manage, and observe microservices-based applications in a uniform way.
            </Text>
            <Text component={TextVariants.p}>
              Red Hat OpenShift Service Mesh is based on the open source{' '}
              <Text
                component={TextVariants.a}
                href="https://www.redhat.com/en/topics/microservices/what-is-istio"
              >
                Istio
              </Text>{' '}
              project and is pre-validated and fully supported to work on Red Hat OpenShift. It can
              be installed with the{' '}
              <Text component={TextVariants.a} href="https://github.com/kiali/kiali-operator">
                Kiali
              </Text>{' '}
              dashboard for managing service mesh, while integrating with{' '}
              <Text
                component={TextVariants.a}
                href="https://www.redhat.com/en/technologies/cloud-computing/openshift/observability"
              >
                Red Hat OpenShift Observability
              </Text>{' '}
              for managing logging, metrics, and distributed tracing.
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
                <b>Identify and diagnose problems easier:</b> Red Hat OpenShift Service Mesh adds
                tracing and visualization so you have a greater understanding of what is happening
                in and across applications as they are running, from start to finish.
              </TextListItem>
              <TextListItem>
                <b>Implement secure zero-trust application networks:</b> Secure your application
                network using Red Hat OpenShift Service Mesh’s tools, including automated identity
                and certificate management, end-to-end mTLS encryption, and fine-grain application
                specific network policies.
              </TextListItem>
              <TextListItem>
                <b>Focus on business value:</b> Give developers time back to delivering business
                value and writing application code.
              </TextListItem>
              <TextListItem>
                <b>Enable traffic management capabilities:</b> Red Hat OpenShift Service Mesh
                provides a control plane and infrastructure that transparently enables traffic
                management capabilities, without requiring developers to make changes to their
                application code. Traffic management policies are language agnostic, making it easy
                to develop and run distributed architectures.
              </TextListItem>
            </TextList>
          </TextContent>
        </StackItem>
        <StackItem>
          <Title headingLevel="h3">Use cases:</Title>
        </StackItem>
        <StackItem>
          <TextContent>
            <Text component={TextVariants.p}>
              Deploy your applications to multiple platforms, including:
            </Text>
            <TextList>
              {[
                'Canary releases',
                'Access control',
                'End-to-end mTLS encryption',
                'A/B testing',
                'Service-to-service authentication',
                'Failure recovery',
              ].map((item) => (
                <TextListItem>{item}</TextListItem>
              ))}
            </TextList>
          </TextContent>
        </StackItem>
        <StackItem>
          <ExternalLink
            data-testid="learn-more-about-red-hat-openshift-service-mesh-drawer-panel-content-link"
            href="https://catalog.redhat.com/software/container-stacks/detail/5ec53e8c110f56bd24f2ddc4"
          >
            Learn more about Red Hat OpenShift Service Mesh
          </ExternalLink>
        </StackItem>
      </Stack>
    ),
  },
};

export { DRAWER_PANEL_CONTENT, DrawerPanelContentNode, PRODUCT_CARD_LOGOS };
