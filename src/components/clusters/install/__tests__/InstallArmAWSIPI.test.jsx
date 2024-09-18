import React from 'react';

import { checkAccessibility, screen, withState } from '~/testUtils';

import githubReleases from '../githubReleases.mock';
import { InstallArmAWSIPI } from '../InstallArmAWSIPI';

jest.mock('../../../../redux/actions', () => ({
  __esModule: true,
  tollboothActions: {
    createAuthToken: jest.fn().mockResolvedValue('foo'),
  },
  githubActions: {
    getLatestRelease: jest.fn(),
  },
}));

describe('InstallArmAWSIPI', () => {
  const dispatch = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('is accessible', async () => {
    const { container } = withState(githubReleases).render(
      <InstallArmAWSIPI token={{}} dispatch={dispatch} />,
    );

    expect(
      await screen.findByText(
        'Install OpenShift on AWS with installer-provisioned ARM infrastructure',
      ),
    ).toBeInTheDocument();
    await checkAccessibility(container);
  });
});
