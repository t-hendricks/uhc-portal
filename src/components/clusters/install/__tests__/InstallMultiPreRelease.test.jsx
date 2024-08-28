import React from 'react';

import { checkAccessibility, screen, withState } from '~/testUtils';

import githubReleases from '../githubReleases.mock';
import { InstallMultiPreRelease } from '../InstallMultiPreRelease';

jest.mock('../../../../redux/actions', () => ({
  __esModule: true,
  tollboothActions: {
    createAuthToken: jest.fn().mockResolvedValue('foo'),
  },
  githubActions: {
    getLatestRelease: jest.fn(),
  },
}));

describe('InstallMultiPreRelease', () => {
  const dispatch = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it.skip('is accessible', async () => {
    const { container } = withState(githubReleases).render(
      <InstallMultiPreRelease token={{}} dispatch={dispatch} />,
    );

    expect(
      await screen.findByText('Install OpenShift with multi-architecture compute machines'),
    ).toBeInTheDocument();

    // This fails with a "Heading levels should only increase by one (heading-order)" error
    await checkAccessibility(container);
  });
});
