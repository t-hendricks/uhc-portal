import React from 'react';
import { screen, checkAccessibility, TestRouter, render } from '~/testUtils';

import InstallOSP from '../InstallOSP';

describe('InstallOSP', () => {
  it('is accessible', async () => {
    const { container } = render(
      <TestRouter>
        <InstallOSP />
      </TestRouter>,
    );

    expect(await screen.findByText('Create an OpenShift Cluster: OpenStack')).toBeInTheDocument();
    await checkAccessibility(container);
  });
});
