import React from 'react';

import { render, screen, within, checkAccessibility } from '@testUtils';

import CancelClusterButton from './CancelClusterButton';

const cluster = {
  name: 'Some Cluster',
  id: 'cluster-id',
};

describe('<CancelClusterButton />', () => {
  it('is accessible by default', async () => {
    const { container } = render(<CancelClusterButton cluster={cluster} />);
    await checkAccessibility(container);
  });

  it('hides modal shown by default', () => {
    // Arrange
    render(<CancelClusterButton cluster={cluster} />);

    // Assert
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('shows modal after button click and is accessible', async () => {
    // Arrange
    const { container, user } = render(<CancelClusterButton cluster={cluster} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Act
    await user.click(screen.getByRole('button', { name: 'Cancel cluster creation' }));

    // Assert
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    await checkAccessibility(container);
  });

  it('closes the modal on Close button click', async () => {
    // Arrange
    const { user } = render(<CancelClusterButton cluster={cluster} />);

    // Act
    await user.click(screen.getByRole('button', { name: 'Cancel cluster creation' }));

    const modal = await screen.findByRole('dialog');
    await user.click(within(modal).getByRole('button', { name: 'Close' }));

    // Assert
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes the modal on Cancel button click', async () => {
    // Arrange
    const { user } = render(<CancelClusterButton cluster={cluster} />);

    // Act
    await user.click(screen.getByRole('button', { name: 'Cancel cluster creation' }));

    const modal = await screen.findByRole('dialog');
    await user.click(within(modal).getByRole('button', { name: 'Cancel' }));

    // Assert
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
