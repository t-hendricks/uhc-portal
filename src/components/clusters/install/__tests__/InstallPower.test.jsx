import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import InstallPower from '../InstallPower';
import { version } from '../InstallTestConstants';

describe('InstallPower', () => {
  it('is accessible', async () => {
    const { container } = render(<InstallPower />);

    expect(
      await screen.findByText('Create an OpenShift Cluster: IBM Power (ppc64le)'),
    ).toBeInTheDocument();
    await checkAccessibility(container);
  });

  it('displays expected doc links', () => {
    render(<InstallPower />);

    expect(screen.getByRole('link', { name: /Learn more about interactive/ })).toHaveAttribute(
      'href',
      `https://docs.openshift.com/container-platform/${version}/installing/installing_on_prem_assisted/installing-on-prem-assisted.html`,
    );

    expect(screen.getByRole('link', { name: /Learn more about full control/ })).toHaveAttribute(
      'href',
      `https://docs.openshift.com/container-platform/${version}/installing/installing_ibm_power/installing-ibm-power.html`,
    );
  });
});
