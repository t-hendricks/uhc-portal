import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import { version } from '../InstallTestConstants';
import InstallVSphere from '../InstallVSphere';

describe('<InstallVSphere />', () => {
  it('is accessible', async () => {
    const { container } = render(<InstallVSphere />);

    expect(screen.getByText('Create an OpenShift Cluster: VMware vSphere')).toBeInTheDocument();
    await checkAccessibility(container);
  });

  it('displays expected doc links', () => {
    render(<InstallVSphere />);

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
      `https://docs.openshift.com/container-platform/${version}/installing/installing_vsphere/ipi/installing-vsphere-installer-provisioned.html`,
    );

    expect(screen.getByRole('link', { name: /Learn more about full control/ })).toHaveAttribute(
      'href',
      `https://docs.openshift.com/container-platform/${version}/installing/installing_vsphere/upi/installing-vsphere.html`,
    );
  });
});
