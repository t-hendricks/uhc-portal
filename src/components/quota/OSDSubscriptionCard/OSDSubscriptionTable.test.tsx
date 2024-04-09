import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import * as Fixtures from '../__tests__/Quota.fixtures';

import OSDSubscriptionTable from './OSDSubscriptionTable';

describe('OSDSubscriptionTable', () => {
  it('is accessible', async () => {
    const { container } = render(<OSDSubscriptionTable {...Fixtures} />);

    expect(await screen.findByRole('row')).toBeInTheDocument();
    await checkAccessibility(container);
  });
});
