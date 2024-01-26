import React from 'react';
import { screen, checkAccessibility, TestRouter, withState } from '~/testUtils';

import { InstallBareMetalIPI } from '../InstallBareMetalIPI';
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

describe('InstallBareMetalIPI', () => {
  const dispatch = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('is accessible', async () => {
    // While this tests passes, it throws a warning: <p> cannot appear as a descendant of <p>
    const { container } = withState(githubReleases).render(
      <TestRouter>
        <InstallBareMetalIPI token={{}} dispatch={dispatch} />
      </TestRouter>,
    );

    expect(
      await screen.findByText(instructionsMapping.baremetal.x86.ipi.title),
    ).toBeInTheDocument();

    await checkAccessibility(container);
  });
});
