import React from 'react';
import { screen, render, checkAccessibility } from '~/testUtils';
import { downloadsCategories } from './downloadsStructure';

import DownloadsCategoryDropdown from './DownloadsCategoryDropdown';

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

    expect(screen.getAllByRole('option')).toHaveLength(downloadsCategories.length);
  });
});
