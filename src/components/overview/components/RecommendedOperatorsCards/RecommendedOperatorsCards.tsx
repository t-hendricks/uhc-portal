import React from 'react';

import { Flex, FlexItem, Title } from '@patternfly/react-core';

import ProductCard from '../ProductCard/ProductCard';

import {
  DRAWER_PANEL_CONTENT,
  DrawerPanelContentNode,
  PRODUCT_CARD_LOGOS,
} from './DrawerPanelContent';

import './RecommendedOperatorsCards.scss';
import ExternalLink from '~/components/common/ExternalLink';

type RecommendedOperatorsCardsNode = {
  title: string;
  description: string;
  logo: string | undefined;
  labelText?: string;
  drawerPanelContent?: DrawerPanelContentNode;
};

const RECOMMENDED_OPERATORS_CARDS: RecommendedOperatorsCardsNode[] = [
  {
    ...PRODUCT_CARD_LOGOS.gitops,
    description:
      'Integrate git repositories, continuous integration/continuous delivery (CI/CD) tools, and Kubernetes.',
    labelText: 'Free',
    drawerPanelContent: DRAWER_PANEL_CONTENT.gitops,
  },
  {
    ...PRODUCT_CARD_LOGOS.pipelines,
    description:
      'Automate your application delivery using a continuous integration and continuous deployment (CI/CD) framework.',
    labelText: 'Free',
    drawerPanelContent: DRAWER_PANEL_CONTENT.pipelines,
  },
  {
    ...PRODUCT_CARD_LOGOS.serviceMesh,
    description: 'Connect, manage, and observe microservices-based applications in a uniform way.',
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
  <div className="recommended-operators-cards">
    <Flex>
      <FlexItem>
        <Title size="xl" headingLevel="h2" className="pf-v5-u-mt-lg">
          Recommended operators
        </Title>
      </FlexItem>
      <FlexItem align={{ default: 'alignRight' }}>
        <ExternalLink
          href="https://catalog.redhat.com/search?searchType=software&deployed_as=Operator"
          className="view-all-in-ecosystem-catalog-button"
        >
          View all in Ecosystem Catalog
        </ExternalLink>
      </FlexItem>
    </Flex>
    <Flex className="pf-v5-u-mb-lg">
      {RECOMMENDED_OPERATORS_CARDS.map((card) => (
        <FlexItem className="pf-v5-u-pt-md" data-testid="product-overview-card-flex-item">
          <ProductCard
            {...card}
            openReadMore={openReadMore}
            isSelected={card.title === selectedCardTitle}
          />
        </FlexItem>
      ))}
    </Flex>
  </div>
);

export default RecommendedOperatorsCards;
