import React from 'react';
import { CompatRouter } from 'react-router-dom-v5-compat';

import { checkAccessibility, render, screen, TestRouter } from '~/testUtils';

import InstallAzure from '../InstallAzure';
import { version } from '../InstallTestConstants';

describe('InstallAzure', () => {
  it('is accessible', async () => {
    const { container } = render(
      <TestRouter>
        <CompatRouter>
          <InstallAzure />
        </CompatRouter>
      </TestRouter>,
    );

    expect(await screen.findByText('Create an OpenShift Cluster: Azure')).toBeInTheDocument();
    await checkAccessibility(container);
  });

  it('displays expected doc links', () => {
    render(
      <TestRouter>
        <CompatRouter>
          <InstallAzure />
        </CompatRouter>
      </TestRouter>,
    );

    expect(screen.getByRole('link', { name: /Learn more about automated/ })).toHaveAttribute(
      'href',
      `https://docs.openshift.com/container-platform/${version}/installing/installing_azure/installing-azure-default.html`,
    );

    expect(screen.getByRole('link', { name: /Learn more about full control/ })).toHaveAttribute(
      'href',
      `https://docs.openshift.com/container-platform/${version}/installing/installing_azure/installing-azure-user-infra.html`,
    );
  });
});
