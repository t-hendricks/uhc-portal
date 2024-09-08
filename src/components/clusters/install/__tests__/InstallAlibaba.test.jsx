import React from 'react';

import { checkAccessibility, screen, withState } from '~/testUtils';

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
      <InstallAlibaba token={{}} dispatch={dispatch} />,
    );

    expect(
      await screen.findByText(
        'Follow the documentation to configure your Alibaba Cloud account and run the installer',
      ),
    ).toBeInTheDocument();
    await checkAccessibility(container);
  });
});
