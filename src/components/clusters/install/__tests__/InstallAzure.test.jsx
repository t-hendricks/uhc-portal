import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import InstallAzure from '../InstallAzure';
import { version } from '../InstallTestConstants';

describe('InstallAzure', () => {
  it('is accessible', async () => {
    const { container } = render(<InstallAzure />);

    expect(await screen.findByText('Create an OpenShift Cluster: Azure')).toBeInTheDocument();
    await checkAccessibility(container);
  });

  it('displays expected doc links', () => {
    render(<InstallAzure />);

    expect(screen.getByRole('link', { name: /Learn more about automated/ })).toHaveAttribute(
      'href',
      `https://docs.openshift.com/container-platform/${version}/installing/installing_azure/ipi/installing-azure-default.html`,
    );

    expect(screen.getByRole('link', { name: /Learn more about full control/ })).toHaveAttribute(
      'href',
      `https://docs.openshift.com/container-platform/${version}/installing/installing_azure/upi/installing-azure-user-infra.html`,
    );
  });
});
