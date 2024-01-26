import React from 'react';
import { screen, checkAccessibility, TestRouter, render } from '~/testUtils';

import InstallAzure from '../InstallAzure';

describe('InstallAzure', () => {
  it('is accessible', async () => {
    const { container } = render(
      <TestRouter>
        <InstallAzure />
      </TestRouter>,
    );

    expect(await screen.findByText('Create an OpenShift Cluster: Azure')).toBeInTheDocument();
    await checkAccessibility(container);
  });
});
