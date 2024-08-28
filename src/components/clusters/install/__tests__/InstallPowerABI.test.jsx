import React from 'react';

import { checkAccessibility, screen, withState } from '~/testUtils';

import githubReleases from '../githubReleases.mock';
import { InstallPowerABI } from '../InstallPowerABI';
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

describe('InstallPowerABI', () => {
  const dispatch = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('is accessible', async () => {
    // While this tests passes, it throws a warning: <p> cannot appear as a descendant of <p>
    const { container } = withState(githubReleases).render(
      <InstallPowerABI token={{}} dispatch={dispatch} />,
    );

    expect(
      await screen.findByText(instructionsMapping.baremetal.ppc.abi.title),
    ).toBeInTheDocument();

    await checkAccessibility(container);
  });
});
