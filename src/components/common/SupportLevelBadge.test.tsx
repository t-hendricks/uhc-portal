import React from 'react';

import { render, screen, within } from '~/testUtils';

import SupportLevelBadge, { SupportLevelType } from './SupportLevelBadge';

describe('<SupportLevelBadge>', () => {
  it('displays "Developer Preview" for devPreview badges', async () => {
    const { user } = render(<SupportLevelBadge type={SupportLevelType.devPreview} />);
    expect(screen.getByText('Developer Preview')).toBeInTheDocument();

    await user.click(screen.getByRole('button'));

    expect(await screen.findByRole('dialog')).toBeInTheDocument();

    expect(within(screen.getByRole('dialog')).getByRole('link')).toHaveAttribute(
      'href',
      'https://access.redhat.com/support/offerings/devpreview',
    );
    expect(
      within(screen.getByRole('dialog')).getByText(
        'Developer preview features provide early access to upcoming product innovations',
        { exact: false },
      ),
    ).toBeInTheDocument();
  });

  it('displays "Cooperative Community" for cooperative community badges', async () => {
    const { user } = render(<SupportLevelBadge type={SupportLevelType.cooperativeCommunity} />);
    expect(screen.getByText('Cooperative Community')).toBeInTheDocument();

    await user.click(screen.getByRole('button'));

    expect(await screen.findByRole('dialog')).toBeInTheDocument();

    expect(within(screen.getByRole('dialog')).getByRole('link')).toHaveAttribute(
      'href',
      'https://access.redhat.com/solutions/5893251',
    );
    expect(
      within(screen.getByRole('dialog')).getByText(
        'Cooperative Community Support provides assistance to Red Hat customers',
        { exact: false },
      ),
    ).toBeInTheDocument();
  });
});
