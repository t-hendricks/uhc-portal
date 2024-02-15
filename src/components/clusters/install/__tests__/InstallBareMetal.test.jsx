import React from 'react';
import { CompatRouter } from 'react-router-dom-v5-compat';
import { screen, checkAccessibility, TestRouter, render } from '~/testUtils';

import InstallBareMetal from '../InstallBareMetal';

describe('BareMetal install', () => {
  it('is accessible', async () => {
    const { container } = render(
      <TestRouter>
        <CompatRouter>
          <InstallBareMetal />
        </CompatRouter>
      </TestRouter>,
    );

    expect(await screen.findByText('Create an OpenShift Cluster: Bare Metal')).toBeInTheDocument();
    await checkAccessibility(container);
  });
});
