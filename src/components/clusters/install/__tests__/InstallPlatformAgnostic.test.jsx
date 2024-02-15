import React from 'react';
import { CompatRouter } from 'react-router-dom-v5-compat';
import { screen, checkAccessibility, TestRouter, render } from '~/testUtils';

import InstallPlatformAgnostic from '../InstallPlatformAgnostic';

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
});
