import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import InstallArmAWS from '../InstallArmAWS';
import { version } from '../InstallTestConstants';

describe('InstallArmAWS', () => {
  it.skip('is accessible', async () => {
    const { container } = render(<InstallArmAWS />);

    expect(await screen.findByText('Hosts controlled with AWS Provider')).toBeInTheDocument();

    // This fails due to multiple accessibility issues
    await checkAccessibility(container);
  });

  it('displays expected doc links', () => {
    render(<InstallArmAWS />);

    expect(screen.getByRole('link', { name: /Learn more about automated/ })).toHaveAttribute(
      'href',
      `https://docs.openshift.com/container-platform/${version}/installing/installing_aws/ipi/installing-aws-default.html`,
    );

    expect(screen.getByRole('link', { name: /Learn more about full control/ })).toHaveAttribute(
      'href',
      `https://docs.openshift.com/container-platform/${version}/installing/installing_aws/upi/installing-aws-user-infra.html`,
    );
  });
});
