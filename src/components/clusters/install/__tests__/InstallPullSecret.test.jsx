import React from 'react';
import { screen, checkAccessibility, TestRouter, withState } from '~/testUtils';

import { InstallPullSecret } from '../InstallPullSecret';
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

describe('<InstallPullSecret />', () => {
  const dispatch = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it.skip('is accessible', async () => {
    const { container } = withState(githubReleases).render(
      <TestRouter>
        <InstallPullSecret token={{}} dispatch={dispatch} />
      </TestRouter>,
    );

    expect(await screen.findByText('Install OpenShift Container Platform 4')).toBeInTheDocument();

    // This fails with a "Heading levels should only increase by one (heading-order)" error
    await checkAccessibility(container);
  });
});
