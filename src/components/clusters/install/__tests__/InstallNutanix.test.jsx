import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import InstallNutanix from '../InstallNutanix';
import { version } from '../InstallTestConstants';

describe('InstallNutanix', () => {
  it('is accessible', async () => {
    const { container } = render(<InstallNutanix />);

    expect(await screen.findByText('Create an OpenShift Cluster: Nutanix AOS')).toBeInTheDocument();
    await checkAccessibility(container);
  });

  it('displays expected doc links', () => {
    render(<InstallNutanix />);

    expect(screen.getByRole('link', { name: /Learn more about interactive/ })).toHaveAttribute(
      'href',
      `https://docs.openshift.com/container-platform/${version}/installing/installing_on_prem_assisted/installing-on-prem-assisted.html`,
    );

    expect(screen.getByRole('link', { name: /Learn more about automated/ })).toHaveAttribute(
      'href',
      `https://docs.openshift.com/container-platform/${version}/installing/installing_nutanix/preparing-to-install-on-nutanix.html`,
    );
  });
});
