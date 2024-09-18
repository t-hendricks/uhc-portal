import React from 'react';

import { checkAccessibility, screen, withState } from '~/testUtils';

import githubReleases from '../githubReleases.mock';
import { InstallIBMZUPI } from '../InstallIBMZUPI';
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

describe('InstallPower', () => {
  const dispatch = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('is accessible', async () => {
    const { container } = withState(githubReleases).render(
      <InstallIBMZUPI token={{}} dispatch={dispatch} />,
    );

    expect(
      await screen.findByText(instructionsMapping.baremetal.s390x.upi.title),
    ).toBeInTheDocument();

    await checkAccessibility(container);
  });
});
