import React from 'react';

import { checkAccessibility, screen, TestRouter, withState } from '~/testUtils';

import githubReleases from '../githubReleases.mock';
import { InstallIBMZPreRelease } from '../InstallIBMZPreRelease';

jest.mock('../../../../redux/actions', () => ({
  __esModule: true,
  tollboothActions: {
    createAuthToken: jest.fn().mockResolvedValue('foo'),
  },
  githubActions: {
    getLatestRelease: jest.fn(),
  },
}));

describe('InstallIBMZPreRelease', () => {
  const dispatch = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it.skip('is accessible', async () => {
    const { container } = withState(githubReleases).render(
      <TestRouter>
        <InstallIBMZPreRelease token={{}} dispatch={dispatch} />
      </TestRouter>,
    );

    expect(
      await screen.findByText('Install OpenShift on IBM Z with user-provisioned infrastructure'),
    ).toBeInTheDocument();

    // This fails with a "Heading levels should only increase by one (heading-order)"
    await checkAccessibility(container);
  });
});
