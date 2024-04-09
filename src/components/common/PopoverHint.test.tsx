import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import PopoverHint from './PopoverHint';

describe('<PopoverHint />', () => {
  it('is accessible', async () => {
    const { container, user } = render(<PopoverHint hint="This is a hint" />);

    // expand so popover is shown
    await user.click(screen.getByRole('button'));
    expect(await screen.findByRole('dialog')).toBeInTheDocument();

    await checkAccessibility(container);
  });

  it('shows "More information" by default', async () => {
    const { user } = render(<PopoverHint hint="This is a hint" />);
    expect(screen.getByRole('button', { name: 'More information' })).toBeInTheDocument();

    await user.click(screen.getByRole('button'));
    expect(await screen.findByRole('dialog')).toBeInTheDocument();

    expect(screen.getByText('This is a hint')).toBeInTheDocument();
  });

  it('shows "Error" by default when has isError prop', async () => {
    const { user } = render(<PopoverHint hint="This is an error hint" isError />);
    expect(screen.getByRole('button', { name: 'Error' })).toBeInTheDocument();

    await user.click(screen.getByRole('button'));
    expect(await screen.findByRole('dialog')).toBeInTheDocument();

    expect(screen.getByText('This is an error hint')).toBeInTheDocument();
  });

  it('shows custom label when buttonAriaLabel prop is set', async () => {
    const { user } = render(
      <PopoverHint hint="This is a hint" buttonAriaLabel="Custom button label!" />,
    );
    expect(screen.getByRole('button', { name: 'Custom button label!' })).toBeInTheDocument();

    await user.click(screen.getByRole('button'));
    expect(await screen.findByRole('dialog')).toBeInTheDocument();

    expect(screen.getByText('This is a hint')).toBeInTheDocument();
  });
});
