import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import ServiceLevelLabel from '../ServiceLevelLabel';

describe('<ServiceLevelLabel />', () => {
  it('is accessible', async () => {
    // Act
    const { container } = render(<ServiceLevelLabel />);

    // Assert
    await checkAccessibility(container);
  });

  it('renders properly', async () => {
    // Act
    render(<ServiceLevelLabel />);

    // Assert
    expect(screen.getByText(/support type/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: /more information/i,
      }),
    ).toBeInTheDocument();
  });
});
