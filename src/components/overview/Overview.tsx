import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom-v5-compat';

import { Flex, FlexItem, PageSection, Title } from '@patternfly/react-core';

import ExternalLink from '~/components/common/ExternalLink';
import InternalTrackingLink from '~/components/common/InternalTrackingLink';

import docLinks from '../../common/installLinks.mjs';
import OpenShiftProductIcon from '../../styles/images/OpenShiftProductIcon.svg';
import { AppPage } from '../App/AppPage';
import { ProductBanner, ProductBannerProps } from '../common/ProductBanner';

import OfferingCard from './components/OfferingCard/OfferingCard';
import DrawerPanel from './components/RecommendedOperatorsCards/DrawerPanel';
import { DrawerPanelContentNode } from './components/RecommendedOperatorsCards/DrawerPanelContent';
import RecommendedOperatorsCards from './components/RecommendedOperatorsCards/RecommendedOperatorsCards';

import './Overview.scss';

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

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [drawerInfo, setDrawerInfo] = useState<{
    title: string;
    content?: DrawerPanelContentNode;
  }>();
  const [selectedCardTitle, setSelectedCardTitle] = useState<string>('');

  const openDrawer = (title: string, content?: DrawerPanelContentNode) => {
    setDrawerInfo({ title, content });
    setIsDrawerOpen(true);

    setSelectedCardTitle(title);
  };

  const closeDrawer = () => {
    setDrawerInfo(undefined);
    setIsDrawerOpen(false);

    setSelectedCardTitle('');
  };

  return (
    <DrawerPanel
      title={drawerInfo?.title}
      content={drawerInfo?.content}
      isOpen={isDrawerOpen}
      onClose={closeDrawer}
    >
      <AppPage title={PAGE_TITLE}>
        <ProductBanner
          icon={openshiftBannerContents.icon}
          learnMoreLink={openshiftBannerContents.learnMoreLink}
          title={openshiftBannerContents.title}
          text={openshiftBannerContents.text}
          dataTestId={openshiftBannerContents.dataTestId}
        />
        <PageSection>
          <Flex>
            <FlexItem>
              <Title size="xl" headingLevel="h2" className="pf-v5-u-mt-lg">
                Featured OpenShift cluster types
              </Title>
            </FlexItem>
            <FlexItem align={{ default: 'alignRight' }}>
              <InternalTrackingLink
                isButton
                to={createClusterURL}
                variant="link"
                data-testid="create-cluster"
                component={CreateClusterLink}
              >
                View all OpenShift cluster types
              </InternalTrackingLink>
            </FlexItem>
          </Flex>
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
          <RecommendedOperatorsCards
            openReadMore={openDrawer}
            selectedCardTitle={selectedCardTitle}
          />
        </PageSection>
      </AppPage>
    </DrawerPanel>
  );
}

export default OverviewEmptyState;
