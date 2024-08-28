import React from 'react';

import { checkAccessibility, screen, withState } from '~/testUtils';

import githubReleases from '../githubReleases.mock';
import { InstallMultiAzureIPI } from '../InstallMultiAzureIPI';
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

describe('InstallMultiAzureIPI', () => {
  const dispatch = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('is accessible', async () => {
    const { container } = withState(githubReleases).render(
      <InstallMultiAzureIPI token={{}} dispatch={dispatch} />,
    );

    expect(await screen.findByText(instructionsMapping.azure.multi.ipi.title)).toBeInTheDocument();

    await checkAccessibility(container);
  });
});
