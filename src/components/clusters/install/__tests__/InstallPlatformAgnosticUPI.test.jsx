import React from 'react';

import { checkAccessibility, screen, withState } from '~/testUtils';

import githubReleases from '../githubReleases.mock';
import { InstallPlatformAgnosticUPI } from '../InstallPlatformAgnosticUPI';
import instructionsMapping from '../instructions/instructionsMapping';

jest.mock('../../../../redux/actions', () => ({
  __esModule: true,
  tollboothActions: {
    createAuthToken: jest.fn().mockResolvedValue('foo'),
  },
  githubActions: {
    getLatestRelease: jest.fn(),
  },
}));

describe('Platform agnostic UPI install', () => {
  const dispatch = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('is accessible', async () => {
    const { container } = withState(githubReleases).render(
      <InstallPlatformAgnosticUPI token={{}} dispatch={dispatch} />,
    );

    expect(await screen.findByText(instructionsMapping.generic.upi.title)).toBeInTheDocument();

    await checkAccessibility(container);
  });
});
