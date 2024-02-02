import * as React from 'react';
import { shallow } from 'enzyme';
import { mockRestrictedEnv, mockRefreshToken, mockUseChrome } from '~/testUtils';
import StepCreateAWSAccountRoles from './StepCreateAWSAccountRoles';

describe('<StepCreateAWSAccountRoles />', () => {
  mockUseChrome();
  describe('in Restricted env', () => {
    const isRestrictedEnv = mockRestrictedEnv();
    mockRefreshToken();

    afterEach(() => {
      isRestrictedEnv.mockReturnValue(false);
    });

    it('login command includes govcloud switch', () => {
      const props = {
        setOfflineToken: () => {},
        offlineToken: 'foo',
      };
      let wrapper = shallow(<StepCreateAWSAccountRoles {...props} />);
      expect(
        (wrapper.find('TokenBox').prop('command') as string).includes('--govcloud'),
      ).toBeFalsy();

      isRestrictedEnv.mockReturnValue(true);
      wrapper = shallow(<StepCreateAWSAccountRoles {...props} />);
      expect(
        (wrapper.find('TokenBox').prop('command') as string).includes('--govcloud'),
      ).toBeTruthy();
    });
  });
});
