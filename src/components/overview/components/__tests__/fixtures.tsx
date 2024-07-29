import React from 'react';

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

export { PRODUCT_CARD_TEST_CASES, DRAWER_PANEL_TEST_CASES };
