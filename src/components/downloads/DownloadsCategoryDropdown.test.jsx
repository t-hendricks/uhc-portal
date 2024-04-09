import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import DownloadsCategoryDropdown from './DownloadsCategoryDropdown';
import { downloadsCategories } from './downloadsStructure';

describe('<DownloadsCategoryDropdown />', () => {
  const setCategory = jest.fn();
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('is accessible', async () => {
    const { container } = render(
      <DownloadsCategoryDropdown selectedCategory="DEV" setCategory={setCategory} />,
    );
    await checkAccessibility(container);
  });

  it('has expected number of options', () => {
    render(<DownloadsCategoryDropdown selectedCategory="DEV" setCategory={setCategory} />);

    expect(screen.getAllByRole('option')).toHaveLength(downloadsCategories().length);
  });
});
