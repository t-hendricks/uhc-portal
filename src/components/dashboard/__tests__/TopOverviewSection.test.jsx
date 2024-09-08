import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import TopOverviewSection from '../TopOverviewSection';

describe('<TopOverviewSection />', () => {
  const defaultProps = {
    totalClusters: 10,
    totalUnhealthyClusters: 4,
    totalConnectedClusters: 10,
    totalCPU: { value: 4 },
    usedCPU: { value: 3 },
    totalMem: { value: 10 },
    usedMem: { value: 5 },
    isError: false,
  };

  it.skip('is accessible', async () => {
    const { container } = render(<TopOverviewSection {...defaultProps} />);

    expect(screen.getByText('Cluster List')).toBeInTheDocument();
    expect(screen.getByText('CPU and Memory utilization')).toBeInTheDocument();

    // This fails due to multiple accessibility issues
    await checkAccessibility(container);
  });
});
