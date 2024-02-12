import React from 'react';
import { screen, render, checkAccessibility, TestRouter } from '~/testUtils';

import InstallOracleCloud from '../InstallOracleCloud';

describe('InstallOracleCloud', () => {
  it('is accessible', async () => {
    const { container } = render(
      <TestRouter>
        <InstallOracleCloud />
      </TestRouter>,
    );

    expect(screen.getByText('Oracle Cloud Infrastructure (virtual machines)')).toBeInTheDocument();
    await checkAccessibility(container);
  });
});
