import React from 'react';
import { screen, render, checkAccessibility } from '~/testUtils';

import HibernatingClusterCard from './HibernatingClusterCard';
import clusterStates from '../clusterStates';

describe('<HibernateClusterModal />', () => {
  const openModal = jest.fn();
  const cluster = {
    id: 'test-id',
    name: 'test-cluster',
    subscription: {
      id: 'subscription-id',
    },
    state: clusterStates.HIBERNATING,
  };
  const defaultProps = {
    cluster,
    openModal,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('is accessible', async () => {
    const { container } = render(<HibernatingClusterCard {...defaultProps} />);

    expect(screen.getByText('Cluster is currently hibernating')).toBeInTheDocument();
    await checkAccessibility(container);
  });
});
