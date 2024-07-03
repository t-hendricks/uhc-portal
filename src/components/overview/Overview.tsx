import React, { useCallback } from 'react';
import { Link } from 'react-router-dom-v5-compat';

import { Flex, FlexItem, Label, PageSection, Title } from '@patternfly/react-core';
// todo: imports for the subcomponent - RecommendedLayeredServicesCardView
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardFooter,
  Split,
  SplitItem /*, Label*/,
} from '@patternfly/react-core';

import ExternalLink from '~/components/common/ExternalLink';
import InternalTrackingLink from '~/components/common/InternalTrackingLink';

import docLinks from '../../common/installLinks.mjs';
import OpenShiftProductIcon from '../../styles/images/OpenShiftProductIcon.svg';
import { AppPage } from '../App/AppPage';
import {
  ListTextLabelLinkCard,
  ListTextLabelLinkCardProps,
} from '../common/ListTextLabelLinkCard/ListTextLabelLinkCard';
import { ProductBanner, ProductBannerProps } from '../common/ProductBanner';

import { OfferingCard } from './OfferingCard/OfferingCard';

import './Overview.scss';

const linkTextLabelLinkCardContents: ListTextLabelLinkCardProps = {
  cardClassName: 'pf-v5-u-mb-lg',
  textLabelLinkItems: [
    {
      listItemText: 'Using Red Hat OpenShift Cluster Manager to work with your OpenShift clusters',
      listItemLabel: <Label color="gold">Documentation</Label>,
      listItemLink: (
        <ExternalLink href={docLinks.OCM_DOCS_MANAGING_CLUSTERS}>Learn More</ExternalLink>
      ),
      dataTestId: 'recommendedContent_OCM',
    },
    {
      listItemText: 'OpenShift Serverless overview',
      listItemLabel: <Label color="gold">Documentation</Label>,
      listItemLink: <ExternalLink href={docLinks.SERVERLESS_ABOUT}>Learn More</ExternalLink>,
      dataTestId: 'recommendedContent_ServerLess',
    },
    {
      listItemText: 'Understanding Service Mesh',
      listItemLabel: <Label color="gold">Documentation</Label>,
      listItemLink: <ExternalLink href={docLinks.SERVICE_MESH_ABOUT}>Learn More</ExternalLink>,
      dataTestId: 'recommendedContent_ServiceMesh',
    },
    {
      listItemText: 'About OpenShift Virtualization',
      listItemLabel: <Label color="gold">Documentation</Label>,
      listItemLink: <ExternalLink href={docLinks.VIRT_ABOUT}>Learn More</ExternalLink>,
      dataTestId: 'recommendedContent_OVIRT',
    },
  ],
};

const openshiftBannerContents: ProductBannerProps = {
  icon: <img src={OpenShiftProductIcon} alt="OpenShift product icon" />,
  learnMoreLink: (
    <ExternalLink href={docLinks.WHAT_IS_OPENSHIFT}>Learn more about OpenShift</ExternalLink>
  ),
  title: 'Get started with OpenShift',
  text: (
    <>
      Focus on work that matters with the industry&#39;s leading hybrid cloud application platform
      powered by Kubernetes.
      <br />
      Develop, modernize, deploy, run, and manage your applications faster and easier.
    </>
  ),
  dataTestId: 'OverviewHeader',
};

const PAGE_TITLE = 'Overview | Red Hat OpenShift Cluster Manager';

function OverviewEmptyState() {
  const createClusterURL = '/create';
  const CreateClusterLink = useCallback(
    (props) => <Link {...props} data-testid="create-cluster" to={createClusterURL} />,
    [],
  );

  {
    /* import pfIcon from './assets/pf-logo-small.svg';
import activeMQIcon from './assets/activemq-core_200x150.png';
import avroIcon from './assets/camel-avro_200x150.png';
import dropBoxIcon from './assets/camel-dropbox_200x150.png';
import infinispanIcon from './assets/camel-infinispan_200x150.png';
import saxonIcon from './assets/camel-saxon_200x150.png';
import sparkIcon from './assets/camel-spark_200x150.png';
import swaggerIcon from './assets/camel-swagger-java_200x150.png';
import azureIcon from './assets/FuseConnector_Icons_AzureServices.png';
import restIcon from './assets/FuseConnector_Icons_REST.png';

const icons = {
    pfIcon,
    activeMQIcon,
    sparkIcon,
    avroIcon,
    azureIcon,
    saxonIcon,
    dropBoxIcon,
    infinispanIcon,
    restIcon,
    swaggerIcon
  }; */
  }

  // todo: This should be in the subcomponent: RecommendedLayeredServicesCardView
  // Could also be in a constants file
  const recommendedLayeredServicesCards = [
    {
      title: 'Red Hat OpenShift GitOps',
      // todo: Does this should be a part of the Card? the '...' or is there some more description ?
      description:
        'A declarative continuous delivery platform based on Argo CD. It enables teams to adobt GitOps principles for managing cluster configuration and automating secure ...',
      // todo: check which icon should I put here
      icon: 'some icon',
      // todo: check which logo should I put here
      logo: 'some logo',
      labelText: 'Free',
      // todo: change link to the proper learn more link !
      learnMoreLink: 'https://prod.foo.redhat.com:1337/openshift/',
    },
    {
      title: 'Red Hat OpenShift Pipelines',
      // todo: Does this should be a part of the Card? the '...' or is there some more description ?
      description:
        'A cloud-native continuous integration and delivery (CI/CD) solution for building pipelines using Tekon. Tekon is a flexible Kubernetes-native open-source CI/CD framework ...',
      // todo: check which icon should I put here
      icon: 'some icon',
      // todo: check which logo should I put here
      logo: 'some logo',
      labelText: 'Free',
      // todo: change link to the proper learn more link !
      learnMoreLink: 'https://prod.foo.redhat.com:1337/openshift/',
    },
    {
      title: 'Red Hat OpenShift Service Mesh',
      // todo: Does this should be a part of the Card? the '...' or is there some more description ?
      description:
        'A platform that provides behavioral insight and operational control over a service mesh, providing a uniform way to connect, secure, and monitor microservices applications.',
      // todo: check which icon should I put here
      icon: 'some icon',
      // todo: check which logo should I put here
      logo: 'some logo',
      labelText: 'Free',
      // todo: change link to the proper learn more link !
      learnMoreLink: 'https://prod.foo.redhat.com:1337/openshift/',
    },
  ];

  return (
    <AppPage title={PAGE_TITLE}>
      <ProductBanner
        icon={openshiftBannerContents.icon}
        learnMoreLink={openshiftBannerContents.learnMoreLink}
        title={openshiftBannerContents.title}
        text={openshiftBannerContents.text}
        dataTestId={openshiftBannerContents.dataTestId}
      />
      <PageSection>
        <Title size="xl" headingLevel="h2" className="pf-v5-u-mt-lg">
          Featured OpenShift cluster types
        </Title>
        <Flex className="pf-v5-u-mb-lg">
          <FlexItem className="pf-v5-u-pt-md" data-testid="offering-card_RHOSD">
            <OfferingCard offeringType="RHOSD" />
          </FlexItem>
          <FlexItem className="pf-v5-u-pt-md" data-testid="offering-card_AWS">
            <OfferingCard offeringType="AWS" />
          </FlexItem>
          <FlexItem className="pf-v5-u-pt-md" data-testid="offering-card_Azure">
            <OfferingCard offeringType="Azure" />
          </FlexItem>
          <FlexItem className="pf-v5-u-pt-md" data-testid="offering-card_RHOCP">
            <OfferingCard offeringType="RHOCP" />
          </FlexItem>
          <FlexItem className="pf-v5-u-pt-md" data-testid="offering-card_RHOIBM">
            <OfferingCard offeringType="RHOIBM" />
          </FlexItem>
          <FlexItem className="pf-v5-u-pt-md" data-testid="offering-card_DEVSNBX">
            <OfferingCard offeringType="DEVSNBX" />
          </FlexItem>
        </Flex>
        <InternalTrackingLink
          isButton
          to={createClusterURL}
          variant="link"
          data-testid="create-cluster"
          component={CreateClusterLink}
        >
          View all OpenShift cluster types
        </InternalTrackingLink>
        <Title size="xl" headingLevel="h2" className="pf-v5-u-mt-lg pf-v5-u-mb-lg">
          Recommended Content
        </Title>
        <ListTextLabelLinkCard {...linkTextLabelLinkCardContents} />
        <ExternalLink
          data-testid="recommendedContentFooterLink"
          href="/openshift/learning-resources"
        >
          Browse all OpenShift learning resources
        </ExternalLink>

        {/* todo: From here down -> should be in a sub component - RecommendedLayeredServicesCardView */}
        <Title size="xl" headingLevel="h2" className="pf-v5-u-mt-lg">
          Recommended layered services
        </Title>
        <Flex className="pf-v5-u-mb-lg">
          {/* todo: This should be an array of cards.map -> every element should be a <Card /> wrapped in a <FlexItem /> */}
          {recommendedLayeredServicesCards.map(
            ({ title, description, icon, logo, labelText, learnMoreLink }) => (
              <FlexItem className="pf-v5-u-pt-md" data-testid={`product-overview-card-${title}`}>
                {/* prev implementation: <OfferingCard offeringType="RHOSD" /> */}
                {/* todo: This should be a sub component - Product Overview Card */}
                <Card className="product-overview-card">
                  <CardHeader>
                    <Split hasGutter style={{ width: '100%' }}>
                      {/* todo: check how this is implemented in the original OfferingCard component */}
                      {/* todo: Should this be with this logo ? OR should it be an icon -> like down */}
                      <SplitItem>{logo}</SplitItem>
                      <SplitItem isFilled />
                      <SplitItem>
                        <Label data-testtag="label" color="blue">
                          {/* todo: check how this is implemented in the original OfferingCard component */}
                          {
                            labelText /* should be free for all cards, but I should specify it in the array of card properties to make it more generic */
                          }
                        </Label>
                      </SplitItem>
                    </Split>
                    {/* todo: check what is the output on the card -> this should be the appropriate icon for each card */}
                    <img src={icon} alt={`${title} icon`} style={{ maxWidth: '60px' }} />
                  </CardHeader>

                  <CardTitle>
                    {/* todo: check card's title size and positioning */}
                    <Title headingLevel="h3">{title}</Title>
                  </CardTitle>
                  <CardBody>{description}</CardBody>
                  <CardFooter>
                    {learnMoreLink ? (
                      <ExternalLink href={learnMoreLink}>Learn more</ExternalLink>
                    ) : undefined}
                  </CardFooter>
                </Card>
              </FlexItem>
            ),
          )}
        </Flex>
      </PageSection>
    </AppPage>
  );
}

export default OverviewEmptyState;
