import React from 'react';
import { render, screen, checkAccessibility, TestRouter } from '~/testUtils';
import { CompatRouter } from 'react-router-dom-v5-compat';
import ClusterListFilterDropdown from './ClusterListFilterDropdown';

describe('<ClusterListFilterDropdown />', () => {
  const setFilter = jest.fn();

  const defaultProps = {
    setFilter,
    currentFilters: {},
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it.skip('is accessible', async () => {
    // TODO: once DropdownDeprecated is not used anymore
    const { container, user } = render(
      <TestRouter>
        <CompatRouter>
          <ClusterListFilterDropdown {...defaultProps} />
        </CompatRouter>
      </TestRouter>,
    );

    await user.click(screen.getByRole('button'));
    expect(await screen.findByRole('menu')).toBeInTheDocument();
    await checkAccessibility(container);
    ['OCP', 'OSD', 'ROSA', 'ARO'].forEach((clusterType) => {
      expect(screen.getByText(clusterType)).toBeInTheDocument();
    });
  });
});
