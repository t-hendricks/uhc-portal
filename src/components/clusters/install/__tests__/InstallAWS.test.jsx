import React from 'react';
import { CompatRouter } from 'react-router-dom-v5-compat';

import { checkAccessibility, render, screen, TestRouter } from '~/testUtils';

import InstallAWS from '../InstallAWS';
import { version } from '../InstallTestConstants';

describe('InstallAWS', () => {
  it('is accessible', async () => {
    const { container } = render(
      <TestRouter>
        <CompatRouter>
          <InstallAWS />
        </CompatRouter>
      </TestRouter>,
    );

    expect(await screen.findByText('Create an OpenShift Cluster: AWS')).toBeInTheDocument();
    await checkAccessibility(container);
  });
  it('displays expected doc links', () => {
    render(
      <TestRouter>
        <CompatRouter>
          <InstallAWS />
        </CompatRouter>
      </TestRouter>,
    );

    expect(screen.getByRole('link', { name: /Learn more about automated/ })).toHaveAttribute(
      'href',
      `https://docs.openshift.com/container-platform/${version}/installing/installing_aws/ipi/installing-aws-default.html`,
    );

    expect(screen.getByRole('link', { name: /Learn more about full control/ })).toHaveAttribute(
      'href',
      `https://docs.openshift.com/container-platform/${version}/installing/installing_aws/upi/installing-aws-user-infra.html`,
    );
  });
});
