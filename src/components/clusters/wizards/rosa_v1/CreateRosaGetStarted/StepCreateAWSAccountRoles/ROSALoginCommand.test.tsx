import * as React from 'react';

import { render, screen, mockRestrictedEnv, mockRefreshToken, mockUseChrome } from '~/testUtils';
import ROSALoginCommand from './ROSALoginCommand';

describe('<ROSALoginCommand />', () => {
  mockUseChrome();

  it('displays skeleton while loading', () => {
    const props = {
      restrictTokens: false,
      error: undefined,
      isLoading: true,
      token: 'fake-token',
      defaultToOfflineTokens: true,
    };
    render(<ROSALoginCommand {...props} />);
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('displays the command to login with sso when offline tokens are restricted', () => {
    const props = {
      restrictTokens: true,
      error: undefined,
      isLoading: false,
      token: '',
      defaultToOfflineTokens: true,
    };
    render(<ROSALoginCommand {...props} />);

    const CLICommandBox = screen.getByRole('textbox', { name: 'Copyable input' });
    expect(CLICommandBox).toHaveValue('rosa login --use-auth-code');
  });

  it('displays the command to login with token when offline tokens are not restricted', () => {
    const props = {
      restrictTokens: false,
      error: undefined,
      isLoading: false,
      token: 'fake-token',
      defaultToOfflineTokens: true,
    };
    render(<ROSALoginCommand {...props} />);
    const CLICommandBox = screen.getByRole('textbox', { name: 'Copyable ROSA login command' });
    expect(CLICommandBox).toHaveValue('rosa login --token="fake-token"');
  });

  it('defaults to offline tokens if failed to fetch org data', () => {
    const props = {
      restrictTokens: undefined,
      error: {
        kind: 'Error',
        id: '500',
        href: '/api/clusters_mgmt/v1/errors/500',
        code: 'CLUSTERS-MGMT-500',
        reason: 'fake-reason',
        operation_id: 'fake-id',
      },
      isLoading: false,
      token: 'fake-token',
      defaultToOfflineTokens: true,
    };
    render(<ROSALoginCommand {...props} />);

    const CLICommandBox = screen.getByRole('textbox', { name: 'Copyable ROSA login command' });
    expect(CLICommandBox).toHaveValue('rosa login --token="fake-token"');
  });

  describe('in Restricted env', () => {
    const isRestrictedEnv = mockRestrictedEnv();
    mockRefreshToken();

    afterEach(() => {
      isRestrictedEnv.mockReturnValue(false);
    });

    it('login command does not includes govcloud switch if not in restricted environment', () => {
      const props = {
        restrictTokens: false,
        error: undefined,
        isLoading: false,
        token: 'fake-token',
        defaultToOfflineTokens: true,
      };

      isRestrictedEnv.mockReturnValue(false);
      render(<ROSALoginCommand {...props} />);

      const CLICommandBox = screen.getByRole('textbox', { name: 'Copyable ROSA login command' });
      expect(CLICommandBox).toHaveValue('rosa login --token="fake-token"');
    });

    it('login command includes govcloud switch in restricted environment', () => {
      const props = {
        restrictTokens: false,
        error: undefined,
        isLoading: false,
        token: 'fake-token',
        defaultToOfflineTokens: true,
      };

      isRestrictedEnv.mockReturnValue(true);
      render(<ROSALoginCommand {...props} />);
      const CLICommandBox = screen.getByRole('textbox', { name: 'Copyable ROSA login command' });
      expect(CLICommandBox).toHaveValue('rosa login --govcloud --token="fake-token"');
    });
  });
});
