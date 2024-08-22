import React from 'react';

import { Flex, FlexItem, Title } from '@patternfly/react-core';

import { DRAWER_PANEL_CONTENT, DrawerPanelContentNode } from '../common/DrawerPanelContent';
import ProductCard from '../common/ProductCard/ProductCard';
import PRODUCT_CARD_LOGOS from '../common/ProductCardLogos';

const TITLE = 'Featured products';

type FeaturedProductsCardsNode = {
  title: string;
  description: string;
  logo: string;
  labelText: string;
  drawerPanelContent: DrawerPanelContentNode;
};

const FEATURED_PRODUCTS_CARDS: FeaturedProductsCardsNode[] = [
  {
    ...PRODUCT_CARD_LOGOS.advancedClusterSecurity,
    description:
      'Protect your containerized Kubernetes workloads in all major clouds and hybrid platforms.',
    labelText: '60-day trial',
    drawerPanelContent: DRAWER_PANEL_CONTENT.advancedClusterSecurity,
  },
  {
    ...PRODUCT_CARD_LOGOS.openshiftAi,
    description:
      'Create and deliver generative and predictive AI models at scale across on-premise and public cloud environments.',
    labelText: '60-day trial',
    drawerPanelContent: DRAWER_PANEL_CONTENT.OpenshiftAi,
  },
];

type FeaturedProductsCardsProps = {
  openLearnMore: (title: string, content?: DrawerPanelContentNode) => void;
  selectedCardTitle: string;
};

const FeaturedProductsCards = ({
  openLearnMore,
  selectedCardTitle,
}: FeaturedProductsCardsProps) => (
  <div className="featured-products-cards">
    <Title size="xl" headingLevel="h2" className="pf-v5-u-mt-lg">
      {TITLE}
    </Title>
    <Flex className="pf-v5-u-mb-lg">
      {FEATURED_PRODUCTS_CARDS.map((card) => (
        <FlexItem className="pf-v5-u-pt-md" data-testid="product-overview-card-flex-item">
          <ProductCard
            {...card}
            openLearnMore={openLearnMore}
            isSelected={card.title === selectedCardTitle}
            dataTestId={TITLE}
          />
        </FlexItem>
      ))}
    </Flex>
  </div>
);

export { FeaturedProductsCards, FEATURED_PRODUCTS_CARDS };
