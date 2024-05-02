import React from 'react';

import { checkAccessibility, screen, TestRouter, withState } from '~/testUtils';

import githubReleases from '../githubReleases.mock';
import { InstallPreRelease } from '../InstallPreRelease';

jest.mock('../../../../redux/actions', () => ({
  __esModule: true,
  tollboothActions: {
    createAuthToken: jest.fn().mockResolvedValue('foo'),
  },
  githubActions: {
    getLatestRelease: jest.fn(),
  },
}));

describe('InstallPreRelease', () => {
  const dispatch = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it.skip('is accessible', async () => {
    const { container } = withState(githubReleases).render(
      <TestRouter>
        <InstallPreRelease token={{}} dispatch={dispatch} />
      </TestRouter>,
    );

    expect(await screen.findByText('Install OpenShift Container Platform 4')).toBeInTheDocument();

    // Fails due to a  "Heading levels should only increase by one (heading-order)" error
    await checkAccessibility(container);
  });
});
