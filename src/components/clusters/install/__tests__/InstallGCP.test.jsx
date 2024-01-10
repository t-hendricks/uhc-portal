import React from 'react';
import { screen, checkAccessibility, TestRouter, render } from '~/testUtils';

import InstallGCP from '../InstallGCP';

describe('InstallGCP', () => {
  it('is accessible', async () => {
    const { container } = render(
      <TestRouter>
        <InstallGCP />
      </TestRouter>,
    );

    expect(await screen.findByText('Create an OpenShift Cluster: GCP')).toBeInTheDocument();
    await checkAccessibility(container);
  });
});
