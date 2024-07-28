import React from 'react';

const BASIC_PRODUCT_CARD_PROPS = {
  title: 'example title',
  description: 'example description',
  logo: 'product-overview-card__logo',
  labelText: 'example labelText',
  drawerPanelContent: {
    head: <div className="test-head-div">example drawer panel content head</div>,
    body: <div className="test-body-div">example drawer panel content body</div>,
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

export { PRODUCT_CARD_TEST_CASES };
