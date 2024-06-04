import React from 'react';
import { CompatRouter } from 'react-router-dom-v5-compat';

import { checkAccessibility, render, screen, TestRouter } from '~/testUtils';

import InstallOSP from '../InstallOSP';
import { version } from '../InstallTestConstants';

describe('InstallOSP', () => {
  it('is accessible', async () => {
    const { container } = render(
      <TestRouter>
        <CompatRouter>
          <InstallOSP />
        </CompatRouter>
      </TestRouter>,
    );

    expect(await screen.findByText('Create an OpenShift Cluster: OpenStack')).toBeInTheDocument();
    await checkAccessibility(container);
  });

  it('displays expected doc links', () => {
    render(
      <TestRouter>
        <CompatRouter>
          <InstallOSP />
        </CompatRouter>
      </TestRouter>,
    );

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
