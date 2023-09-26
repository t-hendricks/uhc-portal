import './OverviewEmptyState.scss';
import React from 'react';
import {
  Button,
  CardBody,
  CardFooter,
  CardTitle,
  Card,
  Title,
  Label,
  Flex,
  FlexItem,
  PageSection,
  CardHeader,
} from '@patternfly/react-core';
import { Link } from 'react-router-dom';
import ExternalLink from '~/components/common/ExternalLink';
import ProductBanner from '../../common/ProductBanner';
import docLinks from '../../../common/installLinks.mjs';
import { OfferingCard } from './OfferingCard/OfferingCard';
import { ListTextLabelLinkCard } from '../../common/ListTextLabelLinkCard/ListTextLabelLinkCard';
import createAWSCluster from '../../../styles/images/Create-AWS-cluster.png';
import OpenShiftProductIcon from '../../../styles/images/OpenShiftProductIcon.svg';

const getStartedMessage =
  "You have 0 clusters detected. Let's create a new cluster or register your existing ones.";

const linkTextLabelLinkCardContents = {
  cardClassName: 'pf-u-mb-lg',
  textLabelLinkItems: [
    {
      listItemText: 'Using Red Hat OpenShift Cluster Manager to work with your OpenShift clusters',
      listItemLabel: <Label color="gold">Documentation</Label>,
      listItemLink: (
        <ExternalLink href={docLinks.OCM_DOCS_MANAGING_CLUSTERS}>Learn More</ExternalLink>
      ),
    },
    {
      listItemText: 'OpenShift Serverless overview',
      listItemLabel: <Label color="gold">Documentation</Label>,
      listItemLink: <ExternalLink href={docLinks.SERVERLESS_ABOUT}>Learn More</ExternalLink>,
    },
    {
      listItemText: 'Understanding Service Mesh',
      listItemLabel: <Label color="gold">Documentation</Label>,
      listItemLink: <ExternalLink href={docLinks.SERVICE_MESH_ABOUT}>Learn More</ExternalLink>,
    },
    {
      listItemText: 'About OpenShift Virtualization',
      listItemLabel: <Label color="gold">Documentation</Label>,
      listItemLink: <ExternalLink href={docLinks.VIRT_ABOUT}>Learn More</ExternalLink>,
    },
  ],
};

const openshiftBannerContents = {
  icon: <img src={OpenShiftProductIcon} alt="Openshift" />,
  learnMoreLink: (
    <ExternalLink href={docLinks.WHAT_IS_OPENSHIFT}>Learn more about OpenShift</ExternalLink>
  ),
  title: 'OpenShift',
  text: (
    <>
      Focus on work that matters with the industry&#39;s leading hybrid cloud application platform
      powered by Kubernetes.
      <br />
      Develop, modernize, deploy, run, and manage your applications faster and easier.
    </>
  ),
};

function OverviewEmptyState() {
  return (
    <>
      <ProductBanner
        icon={openshiftBannerContents.icon}
        learnMoreLink={openshiftBannerContents.learnMoreLink}
        title={openshiftBannerContents.title}
        text={openshiftBannerContents.text}
      />
      <PageSection>
        <Card>
          <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
            <FlexItem>
              <CardHeader>
                <CardTitle>
                  <Title headingLevel="h2">Get started with OpenShift</Title>
                </CardTitle>
              </CardHeader>
              <CardBody>{getStartedMessage}</CardBody>
              <CardFooter>
                <Flex>
                  <FlexItem>
                    <Button
                      variant="primary"
                      component={(props) => (
                        <Link {...props} data-testid="register-cluster" to="/create" />
                      )}
                      isLarge
                    >
                      Create cluster
                    </Button>
                  </FlexItem>
                  <FlexItem>
                    <Button
                      variant="secondary"
                      component={(props) => (
                        <Link {...props} data-testid="register-cluster" to="/register" />
                      )}
                      isLarge
                    >
                      Register a cluster
                    </Button>
                  </FlexItem>
                </Flex>
              </CardFooter>
            </FlexItem>
            <FlexItem alignSelf={{ default: 'alignSelfCenter' }}>
              <img id="create-cluster-card-image" src={createAWSCluster} alt="create a cluster" />
            </FlexItem>
          </Flex>
        </Card>
        <Title size="xl" headingLevel="h2" className="pf-u-mt-lg">
          Featured OpenShift offerings
        </Title>
        <Flex className="pf-u-mb-lg">
          <FlexItem>
            <OfferingCard offeringType="AWS" />
          </FlexItem>
          <FlexItem className="pf-u-pt-md">
            <OfferingCard offeringType="Azure" />
          </FlexItem>
          <FlexItem className="pf-u-pt-md">
            <OfferingCard offeringType="RHOSD" />
          </FlexItem>
        </Flex>
        <Link to="/create">Browse all OpenShift offerings</Link>
        <Title size="xl" headingLevel="h2" className="pf-u-mt-lg pf-u-mb-lg">
          Recommended Content
        </Title>
        <ListTextLabelLinkCard {...linkTextLabelLinkCardContents} />
        <ExternalLink href="/openshift/learning-resources">
          See all OpenShift learning resources
        </ExternalLink>
      </PageSection>
    </>
  );
}

export default OverviewEmptyState;
