import React from 'react';
import { Flex, FlexItem, Title } from '@patternfly/react-core';

import RedHatOpenShiftGitOpsLogo from '../../../../styles/images/RedHatOpenShiftGitOpsLogo.svg';
import RedHatOpenShiftPipelinesLogo from '../../../../styles/images/RedHatOpenShiftPipelinesLogo.svg';
import RedHatOpenShiftServiceMeshLogo from '../../../../styles/images/RedHatOpenShiftServiceMeshLogo.svg';

import ProductCard from '../ProductCard/ProductCard';
import { DRAWER_PANEL_CONTENT, DrawerPanelContentNode } from './DrawerPanelContent';
import './RecommendedOperatorsCards.scss';

type RecommendedOperatorsCardsNode = {
  title: string;
  description: string;
  logo: string | undefined;
  labelText?: string;
  drawerPanelContent?: DrawerPanelContentNode;
};

const RECOMMENDED_OPERATORS_CARDS: RecommendedOperatorsCardsNode[] = [
  {
    title: 'Red Hat OpenShift GitOps',
    description:
      'Integrate git repositories, continuous integration/continuous delivery (CI/CD) tools, and Kubernetes.',
    logo: RedHatOpenShiftGitOpsLogo,
    labelText: 'Free',
    drawerPanelContent: DRAWER_PANEL_CONTENT.gitops,
  },
  {
    title: 'Red Hat OpenShift Pipelines',
    description:
      'Automate your application delivery using a continuous integration and continuous deployment (CI/CD) framework.',
    logo: RedHatOpenShiftPipelinesLogo,
    labelText: 'Free',
    drawerPanelContent: DRAWER_PANEL_CONTENT.pipelines,
  },
  {
    title: 'Red Hat OpenShift Service Mesh',
    description: 'Connect, manage, and observe microservices-based applications in a uniform way.',
    logo: RedHatOpenShiftServiceMeshLogo,
    labelText: 'Free',
    drawerPanelContent: DRAWER_PANEL_CONTENT.serviceMesh,
  },
];

type RecommendedOperatorsCardsProps = {
  openReadMore: (title: string, content?: DrawerPanelContentNode) => void;
  selectedCardTitle: string;
};

const RecommendedOperatorsCards = ({
  openReadMore,
  selectedCardTitle,
}: RecommendedOperatorsCardsProps) => (
  <>
    <Title size="xl" headingLevel="h2" className="pf-v5-u-mt-lg">
      Recommended operators
    </Title>
    <Flex className="pf-v5-u-mb-lg">
      {RECOMMENDED_OPERATORS_CARDS.map((card) => (
        <FlexItem className="pf-v5-u-pt-md" data-testid={`product-overview-card-flex-item`}>
          <ProductCard
            {...card}
            openReadMore={openReadMore}
            isSelected={card.title === selectedCardTitle}
          />
        </FlexItem>
      ))}
    </Flex>
  </>
);

export default RecommendedOperatorsCards;
