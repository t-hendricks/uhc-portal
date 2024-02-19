import React from 'react';
import { CompatRouter } from 'react-router-dom-v5-compat';
import { screen, checkAccessibility, TestRouter, withState } from '~/testUtils';

import { InstallOSPUPI } from '../InstallOSPUPI';
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

describe('InstallOSPUPI', () => {
  const dispatch = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('is accessible', async () => {
    const { container } = withState(githubReleases).render(
      <TestRouter>
        <CompatRouter>
          <InstallOSPUPI token={{}} dispatch={dispatch} />
        </CompatRouter>
      </TestRouter>,
    );

    expect(await screen.findByText(instructionsMapping.openstack.upi.title)).toBeInTheDocument();

    await checkAccessibility(container);
  });
});
