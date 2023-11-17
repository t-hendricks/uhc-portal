import React from 'react';
import { render, screen, checkAccessibility } from '~/testUtils';
import ClusterListFilterDropdown from './ClusterListFilterDropdown';

describe('<ClusterListFilterDropdown />', () => {
  const setFilter = jest.fn();
  const push = jest.fn();

  const defaultProps = {
    setFilter,
    currentFilters: {},
    history: { location: 'my-url', push },
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('is accessible', async () => {
    const { container, user } = render(<ClusterListFilterDropdown {...defaultProps} />);

    await user.click(screen.getByRole('button'));
    expect(await screen.findByRole('menu')).toBeInTheDocument();
    await checkAccessibility(container);
    ['OCP', 'OSD', 'ROSA', 'ARO'].forEach((clusterType) => {
      expect(screen.getByText(clusterType)).toBeInTheDocument();
    });
  });
});
