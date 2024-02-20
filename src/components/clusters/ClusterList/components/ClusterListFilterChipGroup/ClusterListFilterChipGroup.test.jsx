import React from 'react';
import { CompatRouter } from 'react-router-dom-v5-compat';
import { render, screen, checkAccessibility, TestRouter } from '~/testUtils';
import ClusterListFilterChipGroup from './ClusterListFilterChipGroup';

describe('<ClusterListFilterChipGroup />', () => {
  it('is accessible', async () => {
    const { container } = render(
      <TestRouter>
        <CompatRouter>
          <ClusterListFilterChipGroup setFilter={jest.fn()} currentFilters={{ plan_id: ['OSD'] }} />
        </CompatRouter>
      </TestRouter>,
    );

    await checkAccessibility(container);

    expect(screen.getByRole('button', { name: 'Clear filters' })).toBeInTheDocument();
    expect(screen.getByText('Cluster type')).toBeInTheDocument();
  });
});
