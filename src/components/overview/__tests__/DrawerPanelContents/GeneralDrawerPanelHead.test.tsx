import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import GeneralDrawerPanelHead from '../../components/common/DrawerPanelContents/GeneralDrawerPanelHead';
import {
  GENERAL_DRAWER_PANEL_HEAD_BASIC,
  GENERAL_DRAWER_PANEL_HEAD_WITH_LINK,
} from '../../components/fixtures';

import '@testing-library/jest-dom';

describe('<GitopsDrawerPanelHead />', () => {
  it('renders basic elements', async () => {
    // Arrange
    const { container } = render(<GeneralDrawerPanelHead {...GENERAL_DRAWER_PANEL_HEAD_BASIC} />);

    const { title, logo } = GENERAL_DRAWER_PANEL_HEAD_BASIC;

    // Assert
    const titleElement = screen.getByTestId('drawer-panel-content__title');
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveTextContent(title);

    const logoElement = screen.getByTestId(`${title}-drawer-panel-content__logo`);
    expect(logoElement).toBeInTheDocument();
    expect(logoElement).toHaveAttribute('src', logo);
    expect(logoElement).toHaveAttribute('alt', `${title} logo`);

    expect(screen.getByText(/by Red Hat/i)).toBeInTheDocument();

    await checkAccessibility(container);
  });

  it('renders link', async () => {
    // Arrange
    const { container } = render(
      <GeneralDrawerPanelHead {...GENERAL_DRAWER_PANEL_HEAD_WITH_LINK} />,
    );

    const { trialButtonLink } = GENERAL_DRAWER_PANEL_HEAD_WITH_LINK;

    // Assert
    const button = screen.getByText('Start free trial');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('href', trialButtonLink);

    await checkAccessibility(container);
  });
});
