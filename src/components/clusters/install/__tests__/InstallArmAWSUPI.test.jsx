import React from 'react';

import { checkAccessibility, screen, withState } from '~/testUtils';

import githubReleases from '../githubReleases.mock';
import { InstallArmAWSUPI } from '../InstallArmAWSUPI';

jest.mock('../../../../redux/actions', () => ({
  __esModule: true,
  tollboothActions: {
    createAuthToken: jest.fn().mockResolvedValue('foo'),
  },
  githubActions: {
    getLatestRelease: jest.fn(),
  },
}));

describe('InstallArmAWSUPI', () => {
  const dispatch = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('is accessible', async () => {
    const { container } = withState(githubReleases).render(
      <InstallArmAWSUPI token={{}} dispatch={dispatch} />,
    );

    expect(
      await screen.findByText('Install OpenShift on AWS with user-provisioned ARM infrastructure'),
    ).toBeInTheDocument();
    await checkAccessibility(container);
  });
});
