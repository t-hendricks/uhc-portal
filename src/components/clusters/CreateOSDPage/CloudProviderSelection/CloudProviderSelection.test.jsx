import React from 'react';
import { shallow } from 'enzyme';
import { normalizedProducts } from '../../../../common/subscriptionTypes';

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
  hasProductQuota: false,
  osdTrialFeature: false,
  product: normalizedProducts.OSD,
};

describe('<CloudProviderSelection />', () => {
  describe('with no quota', () => {
    it('renders a redirect', () => {
      const wrapper = shallow(<CloudProviderSelection
        {...baseProps}
      />);
      expect(wrapper).toMatchSnapshot();
    });

    describe('and osd trial feature', () => {
      it('renders a redirect', () => {
        const props = {
          ...baseProps,
          osdTrialFeature: true,
          product: normalizedProducts.OSDTrial,
        };
        const wrapper = shallow(<CloudProviderSelection
          {...props}
        />);
        const redirect = wrapper.find('Redirect');
        expect(redirect.length).toBe(1);
        expect(redirect.props().to).toEqual('/create');
      });
    });
  });

  describe('with aws quota', () => {
    it('renders correctly', () => {
      const props = {
        ...baseProps,
        hasAwsQuota: true,
        hasProductQuota: true,
      };
      const wrapper = shallow(<CloudProviderSelection
        {...props}
      />);
      expect(wrapper).toMatchSnapshot();
    });

    describe('and osd trial feature', () => {
      it('renders correctly', () => {
        const props = {
          ...baseProps,
          hasAwsQuota: true,
          hasProductQuota: true,
          osdTrialFeature: true,
        };
        const wrapper = shallow(<CloudProviderSelection
          {...props}
        />);
        expect(wrapper).toMatchSnapshot();
      });
    });
  });

  describe('with gcp quota', () => {
    it('renders correctly', () => {
      const props = {
        ...baseProps,
        hasGcpQuota: true,
        hasProductQuota: true,
      };
      const wrapper = shallow(<CloudProviderSelection
        {...props}
      />);
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('when quota request pending', () => {
    it('renders a spinnter', () => {
      const props = {
        ...baseProps,
        organization: {
          pending: true,
          error: false,
          fulfilled: false,
        },
      };
      const wrapper = shallow(<CloudProviderSelection
        {...props}
      />);
      expect(wrapper).toMatchSnapshot();
    });
  });
});
