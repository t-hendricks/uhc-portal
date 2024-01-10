import React from 'react';
import { screen, checkAccessibility, TestRouter, render } from '~/testUtils';

import InstallASH from '../InstallASH';

describe('InstallASH', () => {
  it('is accessible', async () => {
    const { container } = render(
      <TestRouter>
        <InstallASH />
      </TestRouter>,
    );

    expect(
      await screen.findByText('Create an OpenShift Cluster: Azure Stack Hub'),
    ).toBeInTheDocument();
    await checkAccessibility(container);
  });
});
