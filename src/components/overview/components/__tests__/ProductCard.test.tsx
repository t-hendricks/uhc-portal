import React from 'react';

import { render, screen, userEvent } from '~/testUtils';

import ProductCard from '../ProductCard/ProductCard';
import { PRODUCT_CARD_TEST_CASES } from '../__tests__/fixtures';

import '@testing-library/jest-dom';

describe('ProductCard', () => {
  it('renders an unselected card', async () => {
    render(<ProductCard {...PRODUCT_CARD_TEST_CASES.UNSELECTED} />);

    const { title, description, logo, labelText, drawerPanelContent, openReadMore } =
      PRODUCT_CARD_TEST_CASES.UNSELECTED;

    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(description)).toBeInTheDocument();
    expect(screen.getByText(labelText)).toBeInTheDocument();

    expect(screen.getByTestId(logo)).toBeInTheDocument();
    expect(screen.getByTestId('open-right-drawer-icon')).toBeInTheDocument();

    // todo: I cannot check that this content is being presented in this component level !!
    // expect(screen.getByText(/example drawer panel content head/i)).toBeInTheDocument();
    // expect(screen.getByText(/example drawer panel content body/i)).toBeInTheDocument();

    const readMoreBtn = screen.getByText(/Read more/i);
    await userEvent.click(readMoreBtn);
    expect(openReadMore).toHaveBeenCalled();
    expect(openReadMore).toHaveBeenCalledWith(title, drawerPanelContent);

    const card = screen.getByTestId('product-overview-card');
    expect(card).not.toHaveClass('pf-m-selected-raised');
  });

  it('renders a selected card', () => {
    render(<ProductCard {...PRODUCT_CARD_TEST_CASES.SELECTED} />);

    const card = screen.getByTestId('product-overview-card');
    expect(card).toHaveClass('pf-m-selected-raised');
  });

  it('renders a card without a labelText', () => {
    render(<ProductCard {...PRODUCT_CARD_TEST_CASES.WITHOUT_LABEL_TEXT} />);

    const { labelText } = PRODUCT_CARD_TEST_CASES.SELECTED;

    expect(screen.queryByText(labelText)).not.toBeInTheDocument();
    expect(screen.queryByTestId('label-text')).not.toBeInTheDocument();
  });
});
