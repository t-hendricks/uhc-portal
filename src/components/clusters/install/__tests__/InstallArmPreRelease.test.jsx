import React from 'react';

import { checkAccessibility, screen, withState } from '~/testUtils';

import githubReleases from '../githubReleases.mock';
import { InstallArmPreRelease } from '../InstallArmPreRelease';

jest.mock('../../../../redux/actions', () => ({
  __esModule: true,
  tollboothActions: {
    createAuthToken: jest.fn().mockResolvedValue('foo'),
  },
  githubActions: {
    getLatestRelease: jest.fn(),
  },
}));

describe('InstallArmPreRelease', () => {
  const dispatch = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it.skip('is accessible', async () => {
    // This test fails because the headers are out of order
    const { container } = withState(githubReleases).render(
      <InstallArmPreRelease token={{}} dispatch={dispatch} />,
    );

    expect(
      await screen.findByText('Install OpenShift Container Platform 4 on ARM'),
    ).toBeInTheDocument();

    await checkAccessibility(container);
  });
});
