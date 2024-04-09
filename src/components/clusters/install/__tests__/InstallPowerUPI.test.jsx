import React from 'react';
import { CompatRouter } from 'react-router-dom-v5-compat';

import { checkAccessibility, screen, TestRouter, withState } from '~/testUtils';

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
      <TestRouter>
        <CompatRouter>
          <InstallPowerUPI token={{}} dispatch={dispatch} />
        </CompatRouter>
      </TestRouter>,
    );

    expect(
      await screen.findByText(instructionsMapping.baremetal.ppc.upi.title),
    ).toBeInTheDocument();

    await checkAccessibility(container);
  });
});
