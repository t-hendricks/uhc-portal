import React from 'react';
import { screen, render, checkAccessibility, TestRouter } from '~/testUtils';

import InstallArmBareMetal from '../InstallArmBareMetal';

describe('ARM Bare Metal install', () => {
  it('is accessible', async () => {
    const { container } = render(
      <TestRouter>
        <InstallArmBareMetal />
      </TestRouter>,
    );

    expect(screen.getByText('ARM Bare Metal')).toBeInTheDocument();
    await checkAccessibility(container);
  });
});
