import React from 'react';

import { checkAccessibility, render } from '~/testUtils';

import CostEmptyState from '../CostEmptyState';

describe('<CostEmptyState />', () => {
  it('is accessible', async () => {
    // Act
    const { container } = render(<CostEmptyState />);

    // Assert
    await checkAccessibility(container);
  });
});
