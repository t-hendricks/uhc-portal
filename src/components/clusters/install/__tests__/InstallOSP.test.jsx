import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import InstallOSP from '../InstallOSP';
import { version } from '../InstallTestConstants';

describe('InstallOSP', () => {
  it('is accessible', async () => {
    const { container } = render(<InstallOSP />);

    expect(await screen.findByText('Create an OpenShift Cluster: OpenStack')).toBeInTheDocument();
    await checkAccessibility(container);
  });

  it('displays expected doc links', () => {
    render(<InstallOSP />);

    expect(screen.getByRole('link', { name: /Learn more about automated/ })).toHaveAttribute(
      'href',
      `https://docs.openshift.com/container-platform/${version}/installing/installing_openstack/installing-openstack-installer-custom.html`,
    );

    expect(screen.getByRole('link', { name: /Learn more about full control/ })).toHaveAttribute(
      'href',
      `https://docs.openshift.com/container-platform/${version}/installing/installing_openstack/installing-openstack-user.html`,
    );
  });
});
