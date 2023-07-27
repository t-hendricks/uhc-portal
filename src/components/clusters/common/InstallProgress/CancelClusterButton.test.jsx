import React from 'react';

import { render, screen, within, checkAccessibility } from '@testUtils';

import CancelClusterButton from './CancelClusterButton';

const cluster = {
  name: 'Some Cluster',
  id: 'cluster-id',
};

describe('<CancelClusterButton />', () => {
  it('is accessible by default - modal closed', async () => {
    const { container } = render(<CancelClusterButton cluster={cluster} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await checkAccessibility(container);
  });

  it('is accessible with modal open', async () => {
    const { container } = render(<CancelClusterButton cluster={cluster} defaultOpen />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await checkAccessibility(container);
  });

  it('hides modal shown by default', () => {
    // Arrange
    render(<CancelClusterButton cluster={cluster} />);

    // Assert
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('shows modal after button click ', async () => {
    // Arrange
    const { user } = render(<CancelClusterButton cluster={cluster} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Act
    await user.click(screen.getByRole('button', { name: 'Cancel cluster creation' }));

    // Assert
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('closes the modal on Close button click', async () => {
    // Arrange
    const { user } = render(<CancelClusterButton cluster={cluster} />);

    // Act
    await user.click(screen.getByRole('button', { name: 'Cancel cluster creation' }));

    const modal = screen.getByRole('dialog');
    const closeButton = within(modal).getByRole('button', { name: 'Close' });
    await user.click(closeButton);

    // Assert
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes the modal on Cancel button click', async () => {
    // Arrange
    const { user } = render(<CancelClusterButton cluster={cluster} />);

    // Act
    await user.click(screen.getByRole('button', { name: 'Cancel cluster creation' }));

    const modal = screen.getByRole('dialog');
    const cancelButton = within(modal).getByRole('button', { name: 'Cancel' });
    await user.click(cancelButton);

    // Assert
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
