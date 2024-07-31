import React from 'react';

import {
  DRAWER_PANEL_CONTENT,
  DrawerPanelContentNode,
  PRODUCT_CARD_LOGOS,
} from './RecommendedOperatorsCards/DrawerPanelContent';

const BASIC_PRODUCT_CARD_PROPS = {
  title: 'example title',
  description: 'example description',
  logo: 'product-overview-card__logo',
  labelText: 'example labelText',
  drawerPanelContent: {
    head: <div data-testid="test-head-div">example drawer panel content head</div>,
    body: <div data-testid="test-body-div">example drawer panel content body</div>,
  },
  openReadMore: jest.fn(),
  isSelected: false,
};

const PRODUCT_CARD_TEST_CASES = {
  UNSELECTED: {
    ...BASIC_PRODUCT_CARD_PROPS,
  },

  SELECTED: {
    ...BASIC_PRODUCT_CARD_PROPS,
    isSelected: true,
  },

  WITHOUT_LABEL_TEXT: {
    ...BASIC_PRODUCT_CARD_PROPS,
    labelText: undefined,
  },
};

const BASIC_DRAWER_PANEL_PROPS = {
  children: <div data-testid="children-of-drawer-panel">some children</div>,
  content: {
    head: <div data-testid="test-head-div">example drawer panel content head</div>,
    body: <div data-testid="test-body-div">example drawer panel content body</div>,
  },
  isOpen: true,
  onClose: jest.fn(),
};

const DRAWER_PANEL_TEST_CASES = {
  OPENED: { ...BASIC_DRAWER_PANEL_PROPS },
};

const BASIC_RECCOMENDED_OPERATORS_CARDS_PROPS = {
  openReadMore: jest.fn(),
  selectedCardTitle: '',
};

const RECOMMENDED_OPERATORS_CARDS_TEST_CASES = {
  NON_SELECTED: {
    ...BASIC_RECCOMENDED_OPERATORS_CARDS_PROPS,
  },
  GITOPS_SELECTED: {
    ...BASIC_RECCOMENDED_OPERATORS_CARDS_PROPS,
    selectedCardTitle: PRODUCT_CARD_LOGOS.gitops.title,
  },
};

type RecommendedOperatorsCardsNode = {
  title: string;
  description: string;
  logo: string | undefined;
  labelText?: string;
  drawerPanelContent?: DrawerPanelContentNode;
};

const RECOMMENDED_OPERATORS_CARDS_DATA: RecommendedOperatorsCardsNode[] = [
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

export {
  PRODUCT_CARD_TEST_CASES,
  DRAWER_PANEL_TEST_CASES,
  RECOMMENDED_OPERATORS_CARDS_TEST_CASES,
  RECOMMENDED_OPERATORS_CARDS_DATA,
};
