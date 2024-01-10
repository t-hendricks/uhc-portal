import React from 'react';
import { screen, checkAccessibility, TestRouter, render } from '~/testUtils';

import InstallBareMetal from '../InstallBareMetal';

describe('BareMetal install', () => {
  it('is accessible', async () => {
    const { container } = render(
      <TestRouter>
        <InstallBareMetal />
      </TestRouter>,
    );

    expect(await screen.findByText('Create an OpenShift Cluster: Bare Metal')).toBeInTheDocument();
    await checkAccessibility(container);
  });
});
