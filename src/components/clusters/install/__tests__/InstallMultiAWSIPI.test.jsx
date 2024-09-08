import React from 'react';

import { checkAccessibility, screen, withState } from '~/testUtils';

import githubReleases from '../githubReleases.mock';
import { InstallMultiAWSIPI } from '../InstallMultiAWSIPI';
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

describe('InstallMultiAWSIPI', () => {
  const dispatch = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('is accessible', async () => {
    const { container } = withState(githubReleases).render(
      <InstallMultiAWSIPI token={{}} dispatch={dispatch} />,
    );

    expect(await screen.findByText(instructionsMapping.aws.multi.ipi.title)).toBeInTheDocument();

    await checkAccessibility(container);
  });
});
