import React from 'react';

import { checkAccessibility, screen, withState } from '~/testUtils';

import githubReleases from '../githubReleases.mock';
import { InstallVSphereUPI } from '../InstallVSphereUPI';
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

describe('<InstallVSphereUPI >', () => {
  const dispatch = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('is accessible', async () => {
    const { container } = withState(githubReleases).render(
      <InstallVSphereUPI token={{}} dispatch={dispatch} />,
    );

    expect(await screen.findByText(instructionsMapping.vsphere.upi.title)).toBeInTheDocument();

    await checkAccessibility(container);
  });
});
