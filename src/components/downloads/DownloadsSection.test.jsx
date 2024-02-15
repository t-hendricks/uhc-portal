import React from 'react';
import { screen, render, checkAccessibility } from '~/testUtils';

import DownloadsSection from './DownloadsSection';

describe('<DownloadsSection />', () => {
  describe('with same category selected', () => {
    it('displays title & children', async () => {
      const { container } = render(
        <DownloadsSection selectedCategory="DEV" category="DEV">
          <button type="button">placeholder for test</button>
        </DownloadsSection>,
      );

      expect(screen.getByText('Developer tools')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'placeholder for test' })).toBeInTheDocument();

      await checkAccessibility(container);
    });
  });

  describe('with ALL category selected', () => {
    it('displays title & children', async () => {
      const { container } = render(
        <DownloadsSection selectedCategory="ALL" category="DEV">
          <button type="button">placeholder for test</button>
        </DownloadsSection>,
      );

      expect(screen.getByText('Developer tools')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'placeholder for test' })).toBeInTheDocument();

      await checkAccessibility(container);
    });
  });

  describe('with different category selected', () => {
    it('should render as empty', () => {
      const { container } = render(
        <DownloadsSection selectedCategory="CLI" category="DEV">
          <button type="button">placeholder for test</button>
        </DownloadsSection>,
      );
      expect(container).toBeEmptyDOMElement();
    });
  });
});
