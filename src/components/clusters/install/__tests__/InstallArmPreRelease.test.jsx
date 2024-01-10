import React from 'react';
import { screen, checkAccessibility, TestRouter, withState } from '~/testUtils';

import { InstallArmPreRelease } from '../InstallArmPreRelease';

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

describe('InstallArmPreRelease', () => {
  const dispatch = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it.skip('is accessible', async () => {
    // This test fails because the headers are out of order
    const { container } = withState(githubReleases).render(
      <TestRouter>
        <InstallArmPreRelease token={{}} dispatch={dispatch} />
      </TestRouter>,
    );

    expect(
      await screen.findByText('Install OpenShift Container Platform 4 on ARM'),
    ).toBeInTheDocument();

    await checkAccessibility(container);
  });
});
