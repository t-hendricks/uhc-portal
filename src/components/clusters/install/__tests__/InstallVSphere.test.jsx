import React from 'react';
import { CompatRouter } from 'react-router-dom-v5-compat';
import { screen, render, checkAccessibility, TestRouter } from '~/testUtils';

import InstallVSphere from '../InstallVSphere';

describe('<InstallVSphere />', () => {
  it('is accessible', async () => {
    const { container } = render(
      <TestRouter>
        <CompatRouter>
          <InstallVSphere />
        </CompatRouter>
      </TestRouter>,
    );

    expect(screen.getByText('Create an OpenShift Cluster: VMware vSphere')).toBeInTheDocument();
    await checkAccessibility(container);
  });
});
