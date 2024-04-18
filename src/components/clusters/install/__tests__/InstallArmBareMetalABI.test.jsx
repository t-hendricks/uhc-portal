import React from 'react';
import { CompatRouter } from 'react-router-dom-v5-compat';

import { checkAccessibility, screen, TestRouter, withState } from '~/testUtils';

import githubReleases from '../githubReleases.mock';
import { InstallArmBareMetalABI } from '../InstallArmBareMetalABI';
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

describe('InstallArmBareMetalABI', () => {
  const dispatch = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('is accessible', async () => {
    // While this tests passes, it throws a warning: <p> cannot appear as a descendant of <p>
    const { container } = withState(githubReleases).render(
      <TestRouter>
        <CompatRouter>
          <InstallArmBareMetalABI token={{}} dispatch={dispatch} />
        </CompatRouter>
      </TestRouter>,
    );

    expect(
      await screen.findByText(instructionsMapping.baremetal.arm.abi.title),
    ).toBeInTheDocument();

    await checkAccessibility(container);
  });
});
