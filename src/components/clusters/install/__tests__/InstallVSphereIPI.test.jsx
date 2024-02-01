import React from 'react';
import { screen, checkAccessibility, TestRouter, withState } from '~/testUtils';

import { InstallVSphereIPI } from '../InstallVSphereIPI';
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

describe('<InstallVSphereIPI />', () => {
  const dispatch = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('is accessible', async () => {
    const { container } = withState(githubReleases).render(
      <TestRouter>
        <InstallVSphereIPI token={{}} dispatch={dispatch} />
      </TestRouter>,
    );

    expect(await screen.findByText(instructionsMapping.vsphere.ipi.title)).toBeInTheDocument();

    await checkAccessibility(container);
  });
});
