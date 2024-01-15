import React from 'react';

import { screen, checkAccessibility, TestRouter, withState } from '~/testUtils';
import { InstallAlibaba } from '../InstallAlibaba';
import githubReleases from '../githubReleases.mock';

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
        <InstallAlibaba token={{}} dispatch={dispatch} />
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
