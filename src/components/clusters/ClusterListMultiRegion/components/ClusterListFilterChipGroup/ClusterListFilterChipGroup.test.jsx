import React from 'react';
import { CompatRouter } from 'react-router-dom-v5-compat';

import { checkAccessibility, screen, TestRouter, withState } from '~/testUtils';

import ClusterListFilterChipGroup from './ClusterListFilterChipGroup';

describe('<ClusterListFilterChipGroup />', () => {
  it('is accessible', async () => {
    const { container } = withState(
      { viewOptions: { CLUSTERS_VIEW: { flags: { subscriptionFilter: { plan_id: ['OSD'] } } } } },
      true,
    ).render(
      <TestRouter>
        <CompatRouter>
          <ClusterListFilterChipGroup />
        </CompatRouter>
      </TestRouter>,
    );

    await checkAccessibility(container);

    expect(screen.getByRole('button', { name: 'Clear filters' })).toBeInTheDocument();
    expect(screen.getByText('Cluster type')).toBeInTheDocument();
  });
});
