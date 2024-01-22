import React from 'react';
import { screen, checkAccessibility, TestRouter, withState } from '~/testUtils';

import { InstallNutanixIPI } from '../InstallNutanixIPI';
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

describe('InstallNutanixIPI', () => {
  const dispatch = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('is accessible', async () => {
    const { container } = withState(githubReleases).render(
      <TestRouter>
        <InstallNutanixIPI token={{}} dispatch={dispatch} />
      </TestRouter>,
    );

    expect(await screen.findByText(instructionsMapping.nutanix.ipi.title)).toBeInTheDocument();

    await checkAccessibility(container);
  });
});
