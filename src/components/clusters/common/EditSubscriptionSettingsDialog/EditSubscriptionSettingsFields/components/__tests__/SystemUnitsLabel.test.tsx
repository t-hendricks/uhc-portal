import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import SystemUnitsLabel from '../SystemUnitsLabel';

describe('<SystemUnitsLabel />', () => {
  it('is accessible', async () => {
    // Act
    const { container } = render(<SystemUnitsLabel />);

    // Assert
    await checkAccessibility(container);
  });

  it('renders properly', async () => {
    // Act
    render(<SystemUnitsLabel />);

    // Assert
    expect(screen.getByText(/subscription units/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: /more information/i,
      }),
    ).toBeInTheDocument();
  });
});
