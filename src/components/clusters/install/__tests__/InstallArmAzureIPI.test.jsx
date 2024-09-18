import React from 'react';

import { checkAccessibility, screen, withState } from '~/testUtils';

import githubReleases from '../githubReleases.mock';
import { InstallArmAzureIPI } from '../InstallArmAzureIPI';
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

describe('InstallArmAzureIPI', () => {
  const dispatch = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('is accessible', async () => {
    const { container } = withState(githubReleases).render(
      <InstallArmAzureIPI token={{}} dispatch={dispatch} />,
    );

    expect(await screen.findByText(instructionsMapping.azure.arm.ipi.title)).toBeInTheDocument();

    await checkAccessibility(container);
  });
});
