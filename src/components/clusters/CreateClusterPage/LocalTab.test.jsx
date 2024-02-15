import React from 'react';

import { screen, render, checkAccessibility } from '~/testUtils';
import LocalTab from './LocalTab';

describe('<LocalTab />', () => {
  it('is accessible', async () => {
    const { container } = render(<LocalTab token={{}} />);

    expect(
      await screen.findByText('View the OpenShift Local Getting started guide', {
        exact: false,
      }),
    ).toBeInTheDocument();

    await checkAccessibility(container);
  });
});
