import React from 'react';

import { checkAccessibility, screen, withState } from '~/testUtils';

import ClusterListFilterChipGroup from './ClusterListFilterChipGroup';

describe('<ClusterListFilterChipGroup />', () => {
  it('is accessible', async () => {
    const { container } = withState(
      { viewOptions: { CLUSTERS_VIEW: { flags: { subscriptionFilter: { plan_id: ['OSD'] } } } } },
      true,
    ).render(<ClusterListFilterChipGroup />);

    await checkAccessibility(container);

    expect(screen.getByRole('button', { name: 'Clear filters' })).toBeInTheDocument();
    expect(screen.getByText('Cluster type')).toBeInTheDocument();
  });
});
