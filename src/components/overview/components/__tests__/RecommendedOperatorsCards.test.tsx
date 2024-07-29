import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { CompatRouter } from 'react-router-dom-v5-compat';

import { render, screen, userEvent, waitFor, checkAccessibility } from '~/testUtils';

import RecommendedOperatorsCards from '../RecommendedOperatorsCards/RecommendedOperatorsCards';
import {
  RECOMMENDED_OPERATORS_CARDS_TEST_CASES,
  RECOMMENDED_OPERATORS_CARDS_DATA,
} from '../__tests__/fixtures';

import '@testing-library/jest-dom';

describe('RecommendedOperatorsCards', () => {
  it('renders titel, link and all cards, no card is selected + checks functionality', async () => {
    const { container } = render(
      <BrowserRouter>
        <CompatRouter>
          <RecommendedOperatorsCards {...RECOMMENDED_OPERATORS_CARDS_TEST_CASES.NON_SELECTED} />
        </CompatRouter>
      </BrowserRouter>,
    );

    const { openReadMore } = RECOMMENDED_OPERATORS_CARDS_TEST_CASES.NON_SELECTED;

    // title:
    expect(screen.getByText('Recommended operators')).toBeInTheDocument();

    // link:
    const viewAllInEcosystemCatalogLink = screen.getByText('View all in Ecosystem Catalog');
    expect(viewAllInEcosystemCatalogLink).toBeInTheDocument();
    expect(viewAllInEcosystemCatalogLink).toHaveAttribute(
      'href',
      'https://catalog.redhat.com/search?searchType=software&deployed_as=Operator',
    );

    // Cards Info:
    const readMoreBtns = screen.getAllByTestId('read-more-button');

    const productCardLogos = screen.getAllByTestId('product-overview-card__logo');
    expect(productCardLogos).toHaveLength(3);

    const productOverviewCards = screen.getAllByTestId('product-overview-card');

    RECOMMENDED_OPERATORS_CARDS_DATA.forEach(
      async ({ title, description, logo, drawerPanelContent }, index) => {
        expect(screen.getByText(`${title}`)).toBeInTheDocument();
        expect(screen.getByText(`${description}`)).toBeInTheDocument();

        expect(productCardLogos[index]).toHaveAttribute('src', `${logo}`);

        // before clicking on 'Read more' the card is not selected:
        await waitFor(() =>
          expect(productOverviewCards[index]).not.toHaveClass('pf-m-selected-raised'),
        );
        expect(productOverviewCards[index]).not.toHaveClass('pf-m-selected-raised');

        const readMoreBtn = readMoreBtns[index];
        await userEvent.click(readMoreBtn);

        expect(openReadMore).toHaveBeenCalledWith(title, drawerPanelContent);

        // after the click the card should be selected:
        await waitFor(() =>
          expect(productOverviewCards[index]).toHaveClass('pf-m-selected-raised'),
        );
        expect(productOverviewCards[index]).toHaveClass('pf-m-selected-raised');
      },
    );

    // ensure gitops and pipelines cards are NOT selected
    for (let i = 0; i < 2; i++)
      expect(productOverviewCards[i]).not.toHaveClass('pf-m-selected-raised');

    const labelTexts = screen.getAllByText(/Free/i);
    expect(labelTexts).toHaveLength(3);

    const openRightDrawerIcons = screen.getAllByTestId('open-right-drawer-icon');
    expect(openRightDrawerIcons).toHaveLength(3);

    await checkAccessibility(container);
  });

  it('renders gitops as selected card, and the other two cards are not selected', async () => {
    render(
      <BrowserRouter>
        <CompatRouter>
          <RecommendedOperatorsCards {...RECOMMENDED_OPERATORS_CARDS_TEST_CASES.GITOPS_SELECTED} />
        </CompatRouter>
      </BrowserRouter>,
    );

    const productOverviewCards = screen.getAllByTestId('product-overview-card');
    const gitopsCard = productOverviewCards[0];
    await waitFor(() => expect(gitopsCard).toHaveClass('pf-m-selected-raised'));
    expect(gitopsCard).toHaveClass('pf-m-selected-raised');

    for (let i = 1; i < 3; i++)
      expect(productOverviewCards[i]).not.toHaveClass('pf-m-selected-raised');
  });
});
