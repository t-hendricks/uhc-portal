import React from 'react';
import { render, screen, checkAccessibility } from '~/testUtils';

import ClusterListFilterChipGroup from './ClusterListFilterChipGroup';

describe('<ClusterListFilterChipGroup />', () => {
  it('is accessible', async () => {
    const { container } = render(
      <ClusterListFilterChipGroup
        setFilter={jest.fn()}
        currentFilters={{ plan_id: ['OSD'] }}
        history={{ location: 'my-url', push: jest.fn() }}
      />,
    );

    await checkAccessibility(container);

    expect(screen.getByRole('button', { name: 'Clear filters' })).toBeInTheDocument();
    expect(screen.getByText('Cluster type')).toBeInTheDocument();
  });
});
