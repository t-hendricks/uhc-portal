import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import { WelcomeMessage } from './WelcomeMessage';

describe('<WelcomeMessage />', () => {
  it('is accessible', async () => {
    const { container } = render(<WelcomeMessage />);
    await checkAccessibility(container);
  });

  it('displays a "welcome to ROSA" message', () => {
    render(<WelcomeMessage />);

    expect(
      screen.getByText('Welcome to Red Hat OpenShift Service on AWS (ROSA)'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Create a managed OpenShift cluster on an existing Amazon Web Services (AWS) account.',
      ),
    ).toBeInTheDocument();
  });
});
