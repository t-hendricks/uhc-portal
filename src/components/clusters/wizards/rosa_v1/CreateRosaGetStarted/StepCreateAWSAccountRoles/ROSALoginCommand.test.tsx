import * as React from 'react';
import { shallow } from 'enzyme';
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
    const { getByTestId } = render(<ROSALoginCommand {...props} />);
    const tokenBox = getByTestId('sso-login');
    expect(tokenBox.querySelector('input')?.value).toBe('rosa login --use-auth-code');
  });

  it('displays the command to login with token when offline tokens are not restricted', () => {
    const props = {
      restrictTokens: false,
      error: undefined,
      isLoading: false,
      token: 'fake-token',
      defaultToOfflineTokens: true,
    };
    const { getByTestId } = render(<ROSALoginCommand {...props} />);
    const tokenBox = getByTestId('token-box');
    expect(tokenBox.querySelector('input')?.value).toBe('rosa login --token="fake-token"');
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
    const { getByTestId } = render(<ROSALoginCommand {...props} />);
    const tokenBox = getByTestId('token-box');
    expect(tokenBox.querySelector('input')?.value).toBe('rosa login --token="fake-token"');
  });

  describe('in Restricted env', () => {
    const isRestrictedEnv = mockRestrictedEnv();
    mockRefreshToken();

    afterEach(() => {
      isRestrictedEnv.mockReturnValue(false);
    });

    it('login command includes govcloud switch', () => {
      const props = {
        restrictTokens: false,
        error: undefined,
        isLoading: false,
        token: 'fake-token',
        defaultToOfflineTokens: true,
      };
      let wrapper = shallow(<ROSALoginCommand {...props} />);
      expect(
        (wrapper.find('TokenBox').prop('command') as string).includes('--govcloud'),
      ).toBeFalsy();

      isRestrictedEnv.mockReturnValue(true);
      wrapper = shallow(<ROSALoginCommand {...props} />);
      expect(
        (wrapper.find('TokenBox').prop('command') as string).includes('--govcloud'),
      ).toBeTruthy();
    });
  });
});
