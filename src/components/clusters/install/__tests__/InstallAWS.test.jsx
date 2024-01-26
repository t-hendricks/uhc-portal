import React from 'react';
import { screen, checkAccessibility, TestRouter, render } from '~/testUtils';

import InstallAWS from '../InstallAWS';

describe('InstallAWS', () => {
  it('is accessible', async () => {
    const { container } = render(
      <TestRouter>
        <InstallAWS />
      </TestRouter>,
    );

    expect(await screen.findByText('Create an OpenShift Cluster: AWS')).toBeInTheDocument();
    await checkAccessibility(container);
  });
});
