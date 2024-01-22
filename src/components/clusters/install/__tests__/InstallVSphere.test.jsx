import React from 'react';
import { screen, render, checkAccessibility, TestRouter } from '~/testUtils';

import InstallVSphere from '../InstallVSphere';

describe('<InstallVSphere />', () => {
  it('is accessible', async () => {
    const { container } = render(
      <TestRouter>
        <InstallVSphere />
      </TestRouter>,
    );

    expect(screen.getByText('Create an OpenShift Cluster: VMware vSphere')).toBeInTheDocument();
    await checkAccessibility(container);
  });
});
