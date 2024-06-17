import React from 'react';
import { CompatRouter } from 'react-router-dom-v5-compat';

import { checkAccessibility, render, screen, TestRouter } from '~/testUtils';

import InstallAlibabaCloud from '../InstallAlibabaCloud';

describe('InstallAlibabaCloud', () => {
  it('is accessible', async () => {
    const { container } = render(
      <TestRouter>
        <CompatRouter>
          <InstallAlibabaCloud />
        </CompatRouter>
      </TestRouter>,
    );
    expect(
      await screen.findByText('Create an OpenShift Cluster: Alibaba Cloud'),
    ).toBeInTheDocument();
    await checkAccessibility(container);
  });
});
