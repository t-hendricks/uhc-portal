import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import SupportLevelLabel from '../SupportLevelLabel';

describe('<SupportLevelLabel />', () => {
  it('is accessible', async () => {
    // Act
    const { container } = render(<SupportLevelLabel />);

    // Assert
    await checkAccessibility(container);
  });

  it('renders properly', async () => {
    // Act
    render(<SupportLevelLabel />);

    // Assert
    expect(screen.getByText(/service level agreement \(sla\)/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: /more information/i,
      }),
    ).toBeInTheDocument();
  });
});
