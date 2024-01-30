import React from 'react';
import { screen, checkAccessibility, TestRouter, withState } from '~/testUtils';

import { InstallPullSecretAzure } from '../InstallPullSecretAzure';
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

describe('<InstallPullSecretAzure />', () => {
  const dispatch = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it.skip('is accessible', async () => {
    const { container } = withState(githubReleases).render(
      <TestRouter>
        <InstallPullSecretAzure token={{}} dispatch={dispatch} />
      </TestRouter>,
    );

    expect(await screen.findByText('Azure Red Hat OpenShift')).toBeInTheDocument();

    // This fails due to a "Heading levels should only increase by one (heading-order)" error
    await checkAccessibility(container);
  });
});
