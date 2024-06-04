import React from 'react';
import { CompatRouter } from 'react-router-dom-v5-compat';

import { checkAccessibility, render, screen, TestRouter } from '~/testUtils';

import InstallPlatformAgnostic from '../InstallPlatformAgnostic';
import { version } from '../InstallTestConstants';

describe('Platform agnostic install', () => {
  it('is accessible', async () => {
    const { container } = render(
      <TestRouter>
        <CompatRouter>
          <InstallPlatformAgnostic />
        </CompatRouter>
      </TestRouter>,
    );

    expect(
      await screen.findByText('Create an OpenShift Cluster: Platform agnostic (x86_64)'),
    ).toBeInTheDocument();
    await checkAccessibility(container);
  });

  it('displays expected doc links', () => {
    render(
      <TestRouter>
        <CompatRouter>
          <InstallPlatformAgnostic />
        </CompatRouter>
      </TestRouter>,
    );

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

    expect(screen.getByRole('link', { name: /Learn more about full control/ })).toHaveAttribute(
      'href',
      `https://docs.openshift.com/container-platform/${version}/installing/installing_platform_agnostic/installing-platform-agnostic.html`,
    );
  });
});
