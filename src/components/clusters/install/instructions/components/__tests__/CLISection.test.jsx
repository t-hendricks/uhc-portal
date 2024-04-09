import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import { channels } from '../../../../../../common/installLinks.mjs';
import CLISection from '../CLISection';

describe('<CLISection />', () => {
  const token = { auths: { foo: 'bar' } };
  it('is accessible', async () => {
    const { container } = render(<CLISection token={token} channel={channels.STABLE} />);

    expect(
      await screen.findByText('Download the OpenShift command-line tools', { exact: false }),
    ).toBeInTheDocument();

    await checkAccessibility(container);
  });
});
