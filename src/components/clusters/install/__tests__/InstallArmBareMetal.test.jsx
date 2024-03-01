import React from 'react';
import { CompatRouter } from 'react-router-dom-v5-compat';
import { screen, render, checkAccessibility, TestRouter } from '~/testUtils';

import InstallArmBareMetal from '../InstallArmBareMetal';

import { version } from '../InstallTestConstants';

describe('ARM Bare Metal install', () => {
  it('is accessible', async () => {
    const { container } = render(
      <TestRouter>
        <CompatRouter>
          <InstallArmBareMetal />
        </CompatRouter>
      </TestRouter>,
    );

    expect(screen.getByText('ARM Bare Metal')).toBeInTheDocument();
    await checkAccessibility(container);
  });

  it('displays expected doc links', () => {
    render(
      <TestRouter>
        <CompatRouter>
          <InstallArmBareMetal />
        </CompatRouter>
      </TestRouter>,
    );

    expect(screen.getByRole('link', { name: /Learn more about interactive/ })).toHaveAttribute(
      'href',
      `https://docs.openshift.com/container-platform/${version}/installing/installing_on_prem_assisted/installing-on-prem-assisted.html`,
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
