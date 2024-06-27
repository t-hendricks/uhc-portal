import * as React from 'react';

import { CLI_SSO_AUTHORIZATION } from '~/redux/constants/featureConstants';
import {
  mockRefreshToken,
  mockRestrictedEnv,
  mockUseChrome,
  mockUseFeatureGate,
  render,
  screen,
} from '~/testUtils';

import StepCreateAWSAccountRoles from './StepCreateAWSAccountRoles';

describe('<StepCreateAWSAccountRoles />', () => {
  mockUseChrome();

  it('should display offline tokens deprecation message', () => {
    mockUseFeatureGate([[CLI_SSO_AUTHORIZATION, true]]);
    const props = {
      offlineToken: 'fake-token',
      setOfflineToken: jest.fn(),
    };

    render(<StepCreateAWSAccountRoles {...props} />);
    const DeprecationAlert = screen.getByText('Logging in with offline tokens is deprecated');
    expect(DeprecationAlert).toBeInTheDocument();
  });

  it('should not display offline tokens deprecation message', () => {
    mockUseFeatureGate([[CLI_SSO_AUTHORIZATION, false]]);
    const props = {
      offlineToken: 'fake-token',
      setOfflineToken: jest.fn(),
    };

    render(<StepCreateAWSAccountRoles {...props} />);
    const DeprecationAlert = screen.queryByText('Logging in with offline tokens is deprecated');
    expect(DeprecationAlert).not.toBeInTheDocument();
  });

  describe('in Restricted env', () => {
    const isRestrictedEnv = mockRestrictedEnv();
    mockRefreshToken();

    afterEach(() => {
      isRestrictedEnv.mockReturnValue(false);
    });

    it('should not display offline tokens deprecation message', () => {
      const props = {
        offlineToken: 'fake-token',
        setOfflineToken: jest.fn(),
      };

      isRestrictedEnv.mockReturnValue(false);
      render(<StepCreateAWSAccountRoles {...props} />);

      const DeprecationAlert = screen.queryByText('Logging in with offline tokens is deprecated');
      expect(DeprecationAlert).not.toBeInTheDocument();
    });
  });
});
