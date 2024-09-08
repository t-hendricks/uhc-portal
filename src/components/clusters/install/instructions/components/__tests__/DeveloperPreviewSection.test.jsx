import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import DeveloperPreviewSection from '../DeveloperPreviewSection';

describe('<DeveloperPreviewSection />', () => {
  it('shows correct link text and url with no parameters', async () => {
    const { container } = render(<DeveloperPreviewSection />);

    expect(screen.getByRole('link')).toHaveTextContent('Download pre-release builds');
    expect(screen.getByRole('link')).toHaveAttribute('href', '/openshift/install/pre-release');

    await checkAccessibility(container);
  });

  it('shows correct link text when is not dev preview', () => {
    render(<DeveloperPreviewSection isDevPreviewLink={false} devPreviewLink="/myLink" />);

    expect(screen.getByRole('link')).toHaveTextContent('Download pre-release builds');
    expect(screen.getByRole('link')).toHaveAttribute('href', '/openshift/myLink');
  });

  it('shows correct link text when is dev preview', () => {
    render(<DeveloperPreviewSection isDevPreview devPreviewLink="/myLink" />);

    expect(screen.getByRole('link')).toHaveTextContent('About pre-release builds');
    expect(screen.getByRole('link')).toHaveAttribute('href', '/openshift/myLink');
  });
});
