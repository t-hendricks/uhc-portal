import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import InstallIBMZ from '../InstallIBMZ';
import { version } from '../InstallTestConstants';

describe('InstallIBMZ', () => {
  it('is accessible', async () => {
    const { container } = render(<InstallIBMZ />);

    expect(
      await screen.findByText('Create an OpenShift Cluster: IBM Z (s390x)'),
    ).toBeInTheDocument();
    await checkAccessibility(container);
  });

  it('displays expected doc links', () => {
    render(<InstallIBMZ />);

    expect(screen.getByRole('link', { name: /Learn more about interactive/ })).toHaveAttribute(
      'href',
      `https://docs.openshift.com/container-platform/${version}/installing/installing_on_prem_assisted/installing-on-prem-assisted.html`,
    );

    expect(screen.getByRole('link', { name: /Learn more about full control/ })).toHaveAttribute(
      'href',
      `https://docs.openshift.com/container-platform/${version}/installing/installing_ibm_z/preparing-to-install-on-ibm-z.html`,
    );
  });
});
