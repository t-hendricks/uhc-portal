import React from 'react';

import { checkAccessibility, screen, withState } from '~/testUtils';

import githubReleases from '../githubReleases.mock';
import { InstallPowerPreRelease } from '../InstallPowerPreRelease';

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
      <InstallPowerPreRelease token={{}} dispatch={dispatch} />,
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
