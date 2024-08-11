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

const ServiceMeshDrawerPanelBody = (
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
          project and is pre-validated and fully supported to work on Red Hat OpenShift. It can be
          installed with the{' '}
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
      <Title headingLevel="h3" data-testid="drawer-panel-content-benefits-title">
        Benefits
      </Title>
    </StackItem>
    <StackItem>
      <TextContent>
        <TextList isPlain>
          <TextListItem>
            <b>Identify and diagnose problems easier:</b> Red Hat OpenShift Service Mesh adds
            tracing and visualization so you have a greater understanding of what is happening in
            and across applications as they are running, from start to finish.
          </TextListItem>
          <TextListItem>
            <b>Implement secure zero-trust application networks:</b> Secure your application network
            using Red Hat OpenShift Service Mesh’s tools, including automated identity and
            certificate management, end-to-end mTLS encryption, and fine-grain application specific
            network policies.
          </TextListItem>
          <TextListItem>
            <b>Focus on business value:</b> Give developers time back to delivering business value
            and writing application code.
          </TextListItem>
          <TextListItem>
            <b>Enable traffic management capabilities:</b> Red Hat OpenShift Service Mesh provides a
            control plane and infrastructure that transparently enables traffic management
            capabilities, without requiring developers to make changes to their application code.
            Traffic management policies are language agnostic, making it easy to develop and run
            distributed architectures.
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
            <TextListItem data-testid="use-cases-list-item">{item}</TextListItem>
          ))}
        </TextList>
      </TextContent>
    </StackItem>
    <StackItem className="drawer-panel-content__learn-more">
      <ExternalLink
        data-testid="learn-more-about-red-hat-openshift-service-mesh-drawer-panel-content-link"
        href="https://catalog.redhat.com/software/container-stacks/detail/5ec53e8c110f56bd24f2ddc4"
      >
        Learn more about Red Hat OpenShift Service Mesh
      </ExternalLink>
    </StackItem>
  </Stack>
);

export default ServiceMeshDrawerPanelBody;
