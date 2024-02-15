import React from 'react';
import { CompatRouter } from 'react-router-dom-v5-compat';
import { screen, render, checkAccessibility, TestRouter } from '~/testUtils';

import InstallArmBareMetal from '../InstallArmBareMetal';

describe('ARM Bare Metal install', () => {
  it('is accessible', async () => {
    const { container } = render(
      <TestRouter>
        <CompatRouter>
          <InstallArmBareMetal />
        </CompatRouter>
      </TestRouter>,
    );

    expect(screen.getByText('ARM Bare Metal')).toBeInTheDocument();
    await checkAccessibility(container);
  });
});
