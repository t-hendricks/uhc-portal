import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import * as Fixtures from '../__tests__/Quota.fixtures';

import OSDSubscriptionCard from './OSDSubscriptionCard';

describe('OSDSubscriptionCard', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('is accessible', async () => {
    const { container } = render(<OSDSubscriptionCard {...Fixtures} />);
    expect(await screen.findByText('OpenShift Dedicated')).toBeInTheDocument();

    await checkAccessibility(container);
  });

  it('calls fetch method', () => {
    expect(Fixtures.fetchQuotaCost).not.toHaveBeenCalled();
    render(<OSDSubscriptionCard {...Fixtures} />);
    expect(Fixtures.fetchQuotaCost).toHaveBeenCalled();
  });

  it('should have OSDSubscriptionTable', () => {
    render(<OSDSubscriptionCard {...Fixtures} />);

    expect(screen.getByRole('grid', { name: 'Quota Table' })).toBeInTheDocument();

    // +1 is to account for the heading row
    expect(screen.getAllByRole('row')).toHaveLength(Fixtures.expectedRowsForQuotaCost + 1);
  });
});
