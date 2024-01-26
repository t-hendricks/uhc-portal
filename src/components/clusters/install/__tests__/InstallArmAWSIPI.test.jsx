import React from 'react';
import { screen, checkAccessibility, TestRouter, withState } from '~/testUtils';
import { InstallArmAWSIPI } from '../InstallArmAWSIPI';
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

describe('InstallArmAWSIPI', () => {
  const dispatch = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('is accessible', async () => {
    const { container } = withState(githubReleases).render(
      <TestRouter>
        <InstallArmAWSIPI token={{}} dispatch={dispatch} />
      </TestRouter>,
    );

    expect(
      await screen.findByText(
        'Install OpenShift on AWS with installer-provisioned ARM infrastructure',
      ),
    ).toBeInTheDocument();
    await checkAccessibility(container);
  });
});
