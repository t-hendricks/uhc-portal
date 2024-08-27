import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import BillingModelAlert from '../BillingModelAlert';

describe('<BillingModelAlert />', () => {
  it('is accessible', async () => {
    // Act
    const { container } = render(<BillingModelAlert title="" />);

    // Assert
    await checkAccessibility(container);
  });

  it('is title rendered', async () => {
    // Act
    render(<BillingModelAlert title="whatever the text" />);

    // Assert
    expect(
      screen.getByRole('heading', {
        name: /Info alert: whatever the text/i,
      }),
    ).toBeInTheDocument();
  });
});
