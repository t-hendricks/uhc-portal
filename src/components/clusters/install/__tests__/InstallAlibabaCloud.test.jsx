import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import InstallAlibabaCloud from '../InstallAlibabaCloud';

describe('InstallAlibabaCloud', () => {
  it('is accessible', async () => {
    const { container } = render(<InstallAlibabaCloud />);
    expect(
      await screen.findByText('Create an OpenShift Cluster: Alibaba Cloud'),
    ).toBeInTheDocument();
    await checkAccessibility(container);
  });
});
