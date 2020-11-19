import React from 'react';
import { shallow } from 'enzyme';

import CloudProviderSelection from './CloudProviderSelection';

const baseProps = {
  getOrganizationAndQuota: jest.fn(),
  organization: {
    pending: false,
    error: false,
    fulfilled: true,
  },
  hasGcpQuota: false,
  hasAwsQuota: false,
  // OSD quota is required for selection to render
  hasOSDQuota: false,
};

describe('<CloudProviderSelection />', () => {
  describe('with no quota', () => {
    it('renders a redirect', () => {
      const wrapper = shallow(<CloudProviderSelection
        {...baseProps}
      />);
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('with aws quota', () => {
    it('renders correctly', () => {
      const props = {
        ...baseProps,
        hasAwsQuota: true,
        hasOSDQuota: true,
      };
      const wrapper = shallow(<CloudProviderSelection
        {...props}
      />);
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('with gcp quota', () => {
    it('renders correctly', () => {
      const props = {
        ...baseProps,
        hasGcpQuota: true,
        hasOSDQuota: true,
      };
      const wrapper = shallow(<CloudProviderSelection
        {...props}
      />);
      expect(wrapper).toMatchSnapshot();
    });
  });
});
