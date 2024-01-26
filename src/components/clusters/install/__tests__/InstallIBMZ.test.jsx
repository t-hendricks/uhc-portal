import React from 'react';
import { screen, checkAccessibility, TestRouter, render } from '~/testUtils';

import InstallIBMZ from '../InstallIBMZ';

describe('InstallIBMZ', () => {
  it('is accessible', async () => {
    const { container } = render(
      <TestRouter>
        <InstallIBMZ />
      </TestRouter>,
    );

    expect(
      await screen.findByText('Create an OpenShift Cluster: IBM Z (s390x)'),
    ).toBeInTheDocument();
    await checkAccessibility(container);
  });
});
