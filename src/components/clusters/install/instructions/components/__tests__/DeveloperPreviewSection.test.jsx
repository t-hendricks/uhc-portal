import React from 'react';
import { CompatRouter } from 'react-router-dom-v5-compat';
import { render, screen, checkAccessibility, TestRouter } from '~/testUtils';

import DeveloperPreviewSection from '../DeveloperPreviewSection';

describe('<DeveloperPreviewSection />', () => {
  it('shows correct link text and url with no parameters', async () => {
    const { container } = render(
      <TestRouter>
        <CompatRouter>
          <DeveloperPreviewSection />
        </CompatRouter>
      </TestRouter>,
    );

    expect(screen.getByRole('link')).toHaveTextContent('Download pre-release builds');
    expect(screen.getByRole('link')).toHaveAttribute('href', '/install/pre-release');

    await checkAccessibility(container);
  });

  it('shows correct link text when is not dev preview', () => {
    render(
      <TestRouter>
        <CompatRouter>
          <DeveloperPreviewSection isDevPreviewLink={false} devPreviewLink="/myLink" />
        </CompatRouter>
      </TestRouter>,
    );

    expect(screen.getByRole('link')).toHaveTextContent('Download pre-release builds');
    expect(screen.getByRole('link')).toHaveAttribute('href', '/myLink');
  });

  it('shows correct link text when is dev preview', () => {
    render(
      <TestRouter>
        <CompatRouter>
          <DeveloperPreviewSection isDevPreview devPreviewLink="/myLink" />
        </CompatRouter>
      </TestRouter>,
    );

    expect(screen.getByRole('link')).toHaveTextContent('About pre-release builds');
    expect(screen.getByRole('link')).toHaveAttribute('href', '/myLink');
  });
});
