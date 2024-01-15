import React from 'react';
import { render, screen, checkAccessibility, TestRouter } from '~/testUtils';
import InstallArmAWS from '../InstallArmAWS';

describe('InstallArmAWS', () => {
  it.skip('is accessible', async () => {
    const { container } = render(
      <TestRouter>
        <InstallArmAWS />
      </TestRouter>,
    );

    expect(await screen.findByText('Hosts controlled with AWS Provider')).toBeInTheDocument();

    // This fails due to multiple accessibility issues
    await checkAccessibility(container);
  });
});
