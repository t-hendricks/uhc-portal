import React from 'react';
import { screen, checkAccessibility, TestRouter, render } from '~/testUtils';

import InstallNutanix from '../InstallNutanix';

describe('InstallNutanix', () => {
  it('is accessible', async () => {
    const { container } = render(
      <TestRouter>
        <InstallNutanix />
      </TestRouter>,
    );

    expect(await screen.findByText('Create an OpenShift Cluster: Nutanix AOS')).toBeInTheDocument();
    await checkAccessibility(container);
  });
});
