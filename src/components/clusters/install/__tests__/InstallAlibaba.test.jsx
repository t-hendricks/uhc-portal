import React from 'react';
import { CompatRouter } from 'react-router-dom-v5-compat';

import { checkAccessibility, screen, TestRouter, withState } from '~/testUtils';

import githubReleases from '../githubReleases.mock';
import { InstallAlibaba } from '../InstallAlibaba';

jest.mock('../../../../redux/actions', () => ({
  __esModule: true,
  tollboothActions: {
    createAuthToken: jest.fn().mockResolvedValue('foo'),
  },
  githubActions: {
    getLatestRelease: jest.fn(),
  },
}));

describe('InstallAlibaba', () => {
  const dispatch = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });
  it('is accessible', async () => {
    const { container } = withState(githubReleases).render(
      <TestRouter>
        <CompatRouter>
          <InstallAlibaba token={{}} dispatch={dispatch} />
        </CompatRouter>
      </TestRouter>,
    );

    expect(
      await screen.findByText(
        'Follow the documentation to configure your Alibaba Cloud account and run the installer',
      ),
    ).toBeInTheDocument();
    await checkAccessibility(container);
  });
});
