import React from 'react';

import { checkAccessibility, screen, withState } from '~/testUtils';

import githubReleases from '../githubReleases.mock';
import { InstallPowerUPI } from '../InstallPowerUPI';
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

describe('InstallPower', () => {
  const dispatch = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('is accessible', async () => {
    const { container } = withState(githubReleases).render(
      <InstallPowerUPI token={{}} dispatch={dispatch} />,
    );

    expect(
      await screen.findByText(instructionsMapping.baremetal.ppc.upi.title),
    ).toBeInTheDocument();

    await checkAccessibility(container);
  });
});
