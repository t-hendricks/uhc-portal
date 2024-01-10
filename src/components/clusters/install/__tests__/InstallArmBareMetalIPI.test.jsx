import React from 'react';
import { screen, checkAccessibility, TestRouter, withState } from '~/testUtils';

import { InstallArmBareMetalIPI } from '../InstallArmBareMetalIPI';
import instructionsMapping from '../instructions/instructionsMapping';
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

describe('Arm BareMetal IPI install', () => {
  const dispatch = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('is accessible', async () => {
    // While this test passes, it throws a warning that a <p> cannot appear as a descendant of <p>
    const { container } = withState(githubReleases).render(
      <TestRouter>
        <InstallArmBareMetalIPI token={{}} dispatch={dispatch} />
      </TestRouter>,
    );

    expect(
      await screen.findByText(instructionsMapping.baremetal.arm.ipi.title),
    ).toBeInTheDocument();

    await checkAccessibility(container);
  });
});
