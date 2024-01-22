import React from 'react';
import { withState, screen, checkAccessibility, TestRouter } from '~/testUtils';
import githubReleasesMock from '../../../githubReleases.mock';

import { tools, channels } from '../../../../../../common/installLinks.mjs';
import DownloadsAndPullSecretSection from '../DownloadsAndPullSecretSection';

jest.mock('~/redux/actions', () => ({
  __esModule: true,
  tollboothActions: {
    createAuthToken: jest.fn().mockResolvedValue('foo'),
  },
  githubActions: {
    getLatestRelease: jest.fn(),
  },
}));

describe('<DownloadsAndPullSecretSection />', () => {
  const defaultProps = {
    tool: tools.X86INSTALLER,
    channel: channels.STABLE,
  };

  describe('with token', () => {
    const token = { auths: { foo: 'bar' } };
    it('is accessible', async () => {
      const { container } = withState(githubReleasesMock).render(
        <TestRouter>
          <DownloadsAndPullSecretSection {...defaultProps} token={token} />
        </TestRouter>,
      );

      expect(screen.getByRole('button', { name: 'Download pull secret' })).toHaveAttribute(
        'aria-disabled',
        'false',
      );

      await checkAccessibility(container);
    });
  });

  describe('with error', () => {
    const badToken = { error: 'my error' };

    it('is accessible', async () => {
      const { container } = withState(githubReleasesMock).render(
        <TestRouter>
          <DownloadsAndPullSecretSection {...defaultProps} token={badToken} />
        </TestRouter>,
      );

      expect(screen.getByRole('button', { name: 'Download pull secret' })).toHaveAttribute(
        'aria-disabled',
        'true',
      );

      await checkAccessibility(container);
    });
  });
});
