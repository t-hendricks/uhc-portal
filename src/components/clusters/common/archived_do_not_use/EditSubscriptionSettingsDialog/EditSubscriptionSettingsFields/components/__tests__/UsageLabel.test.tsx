import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import UsageLabel from '../UsageLabel';

describe('<UsageLabel />', () => {
  it('is accessible', async () => {
    // Act
    const { container } = render(<UsageLabel />);

    // Assert
    await checkAccessibility(container);
  });

  it('renders properly', async () => {
    // Act
    render(<UsageLabel />);

    // Assert
    expect(screen.getByText(/cluster usage/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: /more information/i,
      }),
    ).toBeInTheDocument();
  });
});
