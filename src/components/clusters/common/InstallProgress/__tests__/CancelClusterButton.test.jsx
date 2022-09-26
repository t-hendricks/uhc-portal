import React from 'react';

import { render, screen, within, waitFor, userEvent } from '@testUtils';

import CancelClusterButton from '../CancelClusterButton';

const cluster = {
  name: 'Some Cluster',
  id: 'cluster-id',
};

describe('CancelClusterButton', () => {
  it('has no modal shown by default', () => {
    render(<CancelClusterButton cluster={cluster} />);

    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('has visible modal after button click', async () => {
    render(<CancelClusterButton cluster={cluster} />);

    userEvent.click(screen.getByRole('button', { name: 'Cancel cluster creation' }));
    expect(await screen.findByRole('dialog')).toBeVisible();
  });

  it('closes the modal on Close button click', async () => {
    render(<CancelClusterButton cluster={cluster} />);

    userEvent.click(screen.getByRole('button', { name: 'Cancel cluster creation' }));

    const modal = await screen.findByRole('dialog');
    userEvent.click(within(modal).getByRole('button', { name: 'Close' }));

    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });

  it('closes the modal on Cancel button click', async () => {
    render(<CancelClusterButton cluster={cluster} />);

    userEvent.click(screen.getByRole('button', { name: 'Cancel cluster creation' }));

    const modal = await screen.findByRole('dialog');
    userEvent.click(within(modal).getByRole('button', { name: 'Cancel' }));

    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });
});
