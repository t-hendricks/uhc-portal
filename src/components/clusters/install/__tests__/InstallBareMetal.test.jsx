import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import InstallBareMetal from '../InstallBareMetal';
import { version } from '../InstallTestConstants';

describe('BareMetal install', () => {
  it('is accessible', async () => {
    const { container } = render(<InstallBareMetal />);

    expect(await screen.findByText('Create an OpenShift Cluster: Bare Metal')).toBeInTheDocument();
    await checkAccessibility(container);
  });

  it('displays expected doc links', () => {
    render(<InstallBareMetal />);

    expect(screen.getByRole('link', { name: /Learn more about interactive/ })).toHaveAttribute(
      'href',
      `https://docs.openshift.com/container-platform/${version}/installing/installing_on_prem_assisted/installing-on-prem-assisted.html`,
    );

    expect(
      screen.getByRole('link', { name: /Learn more about local agent-based/ }),
    ).toHaveAttribute(
      'href',
      `https://docs.openshift.com/container-platform/${version}/installing/installing_with_agent_based_installer/preparing-to-install-with-agent-based-installer.html`,
    );

    expect(screen.getByRole('link', { name: /Learn more about automated/ })).toHaveAttribute(
      'href',
      `https://docs.openshift.com/container-platform/${version}/installing/installing_bare_metal_ipi/ipi-install-overview.html`,
    );

    expect(screen.getByRole('link', { name: /Learn more about full control/ })).toHaveAttribute(
      'href',
      `https://docs.openshift.com/container-platform/${version}/installing/installing_bare_metal/installing-bare-metal.html`,
    );
  });
});
