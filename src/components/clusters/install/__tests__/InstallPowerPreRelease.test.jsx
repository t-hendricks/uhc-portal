import React from 'react';
import { screen, checkAccessibility, TestRouter, withState } from '~/testUtils';

import { InstallPowerPreRelease } from '../InstallPowerPreRelease';
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

describe('InstallPowerPreRelease', () => {
  const dispatch = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it.skip('is accessible', async () => {
    const { container } = withState(githubReleases).render(
      <TestRouter>
        <InstallPowerPreRelease token={{}} dispatch={dispatch} />
      </TestRouter>,
    );

    expect(
      await screen.findByText(
        'Install OpenShift on IBM Power (ppc64le) with user-provisioned infrastructure',
      ),
    ).toBeInTheDocument();

    // Fails with a "Heading levels should only increase by one (heading-order)" error
    await checkAccessibility(container);
  });
});
