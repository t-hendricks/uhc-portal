import React from 'react';
import { CompatRouter } from 'react-router-dom-v5-compat';
import { render, screen, within, checkAccessibility, TestRouter } from '~/testUtils';

import CancelClusterButton from './CancelClusterButton';

const cluster = {
  name: 'Some Cluster',
  id: 'cluster-id',
};

describe('<CancelClusterButton />', () => {
  it('is accessible by default - modal closed', async () => {
    const { container } = render(
      <TestRouter>
        <CompatRouter>
          <CancelClusterButton cluster={cluster} />
        </CompatRouter>
      </TestRouter>,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await checkAccessibility(container);
  });

  it('is accessible with modal open', async () => {
    const { container } = render(
      <TestRouter>
        <CompatRouter>
          <CancelClusterButton cluster={cluster} defaultOpen />
        </CompatRouter>
      </TestRouter>,
    );
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    await checkAccessibility(container);
  });

  it('hides modal shown by default', () => {
    // Arrange
    render(
      <TestRouter>
        <CompatRouter>
          <CancelClusterButton cluster={cluster} />
        </CompatRouter>
      </TestRouter>,
    );

    // Assert
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('shows modal after button click ', async () => {
    // Arrange
    const { user } = render(
      <TestRouter>
        <CompatRouter>
          <CancelClusterButton cluster={cluster} />
        </CompatRouter>
      </TestRouter>,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Act
    await user.click(screen.getByRole('button', { name: 'Cancel cluster creation' }));

    // Assert
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
  });

  it('closes the modal on Close button click', async () => {
    // Arrange
    const { user } = render(
      <TestRouter>
        <CompatRouter>
          <CancelClusterButton cluster={cluster} />
        </CompatRouter>
      </TestRouter>,
    );

    // Act
    await user.click(screen.getByRole('button', { name: 'Cancel cluster creation' }));
    expect(await screen.findByRole('dialog')).toBeInTheDocument();

    const modal = screen.getByRole('dialog');
    const closeButton = within(modal).getByRole('button', { name: 'Close' });
    await user.click(closeButton);

    // Assert
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes the modal on Cancel button click', async () => {
    // Arrange
    const { user } = render(
      <TestRouter>
        <CompatRouter>
          <CancelClusterButton cluster={cluster} />
        </CompatRouter>
      </TestRouter>,
    );

    // Act
    await user.click(screen.getByRole('button', { name: 'Cancel cluster creation' }));
    expect(await screen.findByRole('dialog')).toBeInTheDocument();

    const modal = screen.getByRole('dialog');
    const cancelButton = within(modal).getByRole('button', { name: 'Cancel' });
    await user.click(cancelButton);

    // Assert
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
