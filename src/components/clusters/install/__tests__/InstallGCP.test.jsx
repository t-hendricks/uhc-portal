import React from 'react';
import { CompatRouter } from 'react-router-dom-v5-compat';
import { screen, checkAccessibility, TestRouter, render } from '~/testUtils';

import InstallGCP from '../InstallGCP';

describe('InstallGCP', () => {
  it('is accessible', async () => {
    const { container } = render(
      <TestRouter>
        <CompatRouter>
          <InstallGCP />
        </CompatRouter>
      </TestRouter>,
    );

    expect(await screen.findByText('Create an OpenShift Cluster: GCP')).toBeInTheDocument();
    await checkAccessibility(container);
  });
});
