import React from 'react';

import { screen, render, checkAccessibility } from '~/testUtils';

import * as Fixtures from '../__test__/Quota.fixtures';

import OSDSubscriptionTable from './OSDSubscriptionTable';

describe('OSDSubscriptionTable', () => {
  it('is accessible', async () => {
    const { container } = render(<OSDSubscriptionTable {...Fixtures} />);

    expect(await screen.findByRole('row')).toBeInTheDocument();
    await checkAccessibility(container);
  });
});
