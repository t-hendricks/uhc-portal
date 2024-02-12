import React from 'react';
import { CompatRouter } from 'react-router-dom-v5-compat';
import { screen, render, checkAccessibility, TestRouter } from '~/testUtils';
import InstallOracleCloud from '../InstallOracleCloud';

describe('InstallOracleCloud', () => {
  it('is accessible', async () => {
    const { container } = render(
      <TestRouter>
        <CompatRouter>
          <InstallOracleCloud />
        </CompatRouter>
      </TestRouter>,
    );
    expect(
      await screen.findByText(
        'Create an OpenShift Cluster: Oracle Cloud Infrastructure (virtual machines)',
      ),
    ).toBeInTheDocument();
    await checkAccessibility(container);
  });
});
