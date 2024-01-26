import React from 'react';
import { screen, checkAccessibility, TestRouter, render } from '~/testUtils';

import InstallPower from '../InstallPower';

describe('InstallPower', () => {
  it('is accessible', async () => {
    const { container } = render(
      <TestRouter>
        <InstallPower />
      </TestRouter>,
    );

    expect(
      await screen.findByText('Create an OpenShift Cluster: IBM Power (ppc64le)'),
    ).toBeInTheDocument();
    await checkAccessibility(container);
  });
});
