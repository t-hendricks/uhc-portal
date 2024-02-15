import React from 'react';
import { CompatRouter } from 'react-router-dom-v5-compat';
import { screen, checkAccessibility, TestRouter, render } from '~/testUtils';

import InstallAzure from '../InstallAzure';

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
});
