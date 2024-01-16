import './Overview.scss';
import React from 'react';
import { Button, Title, Label, Flex, FlexItem, PageSection } from '@patternfly/react-core';
import { Link } from 'react-router-dom';
import ExternalLink from '~/components/common/ExternalLink';
import useAnalytics from '~/hooks/useAnalytics';
import { trackEvents } from '~/common/analytics';
import { ProductBanner, ProductBannerProps } from '../common/ProductBanner';
import docLinks from '../../common/installLinks.mjs';
import {
  ListTextLabelLinkCard,
  ListTextLabelLinkCardProps,
} from '../common/ListTextLabelLinkCard/ListTextLabelLinkCard';
import OpenShiftProductIcon from '../../styles/images/OpenShiftProductIcon.svg';
import { OfferingCard } from './OfferingCard/OfferingCard';
import { AppPage } from '../App/AppPage';

const linkTextLabelLinkCardContents: ListTextLabelLinkCardProps = {
  cardClassName: 'pf-v5-u-mb-lg',
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
};

function OverviewEmptyState() {
  const track = useAnalytics();
  const createClusterURL = '/create';
  return (
    <AppPage>
      <ProductBanner
        icon={openshiftBannerContents.icon}
        learnMoreLink={openshiftBannerContents.learnMoreLink}
        title={openshiftBannerContents.title}
        text={openshiftBannerContents.text}
      />
      <PageSection>
        <Title size="xl" headingLevel="h2" className="pf-v5-u-mt-lg">
          Featured OpenShift cluster types
        </Title>
        <Flex className="pf-v5-u-mb-lg">
          <FlexItem className="pf-v5-u-pt-md">
            <OfferingCard offeringType="RHOSD" />
          </FlexItem>
          <FlexItem className="pf-v5-u-pt-md">
            <OfferingCard offeringType="AWS" />
          </FlexItem>
          <FlexItem className="pf-v5-u-pt-md">
            <OfferingCard offeringType="Azure" />
          </FlexItem>
          <FlexItem className="pf-v5-u-pt-md">
            <OfferingCard offeringType="RHOCP" />
          </FlexItem>
          <FlexItem className="pf-v5-u-pt-md">
            <OfferingCard offeringType="RHOIBM" />
          </FlexItem>
          <FlexItem className="pf-v5-u-pt-md">
            <OfferingCard offeringType="DEVSNBX" />
          </FlexItem>
        </Flex>
        <Button
          variant="link"
          component={(props) => (
            <Link
              {...props}
              onClick={() => {
                track(trackEvents.CreateCluster, {
                  url: createClusterURL,
                  path: window.location.pathname,
                });
              }}
              data-testid="create-cluster"
              to={createClusterURL}
            />
          )}
        >
          View all OpenShift cluster types
        </Button>
        <Title size="xl" headingLevel="h2" className="pf-v5-u-mt-lg pf-v5-u-mb-lg">
          Recommended Content
        </Title>
        <ListTextLabelLinkCard {...linkTextLabelLinkCardContents} />
        <ExternalLink href="/openshift/learning-resources">
          Browse all OpenShift learning resources
        </ExternalLink>
      </PageSection>
    </AppPage>
  );
}

export default OverviewEmptyState;
