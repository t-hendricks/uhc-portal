import React from 'react';
import { CompatRouter } from 'react-router-dom-v5-compat';

import { checkAccessibility, screen, TestRouter, withState } from '~/testUtils';

import { channels, tools } from '../../../../../../common/installLinks.mjs';
import githubReleasesMock from '../../../githubReleases.mock';
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
          <CompatRouter>
            <DownloadsAndPullSecretSection {...defaultProps} token={token} />
          </CompatRouter>
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
          <CompatRouter>
            <DownloadsAndPullSecretSection {...defaultProps} token={badToken} />
          </CompatRouter>
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
