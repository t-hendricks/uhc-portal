import React from 'react';
import { mount } from 'enzyme';

import LoadBalancersDropdown from './LoadBalancersDropdown';

const baseState = {
  error: false,
  errorMessage: '',
  pending: false,
  fulfilled: false,
  values: [],
};

const organizationState = {
  fulfilled: true,
  pending: false,
};

describe('<LoadBalancersDropdown />', () => {
  describe('when load balancer list needs to be fetched', () => {
    let getLoadBalancers;
    let onChange;
    let wrapper;
    beforeAll(() => {
      getLoadBalancers = jest.fn();
      onChange = jest.fn();
      wrapper = mount(
        <LoadBalancersDropdown
          loadBalancerValues={baseState}
          input={{ onChange }}
          getLoadBalancers={getLoadBalancers}
          quota={0}
          organization={organizationState}
          disabled={false}
        />,
      );
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('calls getLoadBalancers', () => {
      expect(getLoadBalancers).toBeCalled();
    });
  });

  describe('when there was an error', () => {
    let getLoadBalancers;
    let onChange;
    let wrapper;
    beforeAll(() => {
      const state = {
        ...baseState,
        error: true,
        errorMessage: 'This is an error message',
      };

      getLoadBalancers = jest.fn();
      onChange = jest.fn();
      wrapper = mount(
        <LoadBalancersDropdown
          loadBalancerValues={state}
          input={{ onChange }}
          getLoadBalancers={getLoadBalancers}
          quota={0}
          organization={organizationState}
          disabled={false}
        />,
      );
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('when the request is pending', () => {
    let getLoadBalancers;
    let onChange;
    let wrapper;
    const state = {
      error: false,
      errorMessage: '',
      pending: true,
      fulfilled: false,
      values: [],
    };
    beforeAll(() => {
      getLoadBalancers = jest.fn();
      onChange = jest.fn();
      wrapper = mount(
        <LoadBalancersDropdown
          loadBalancerValues={state}
          input={{ onChange }}
          getLoadBalancers={getLoadBalancers}
          quota={0}
          organization={organizationState}
          disabled={false}
        />,
      );
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('does not call getLoadBalancers again if request returns an error', () => {
      wrapper.setProps({
        loadBalancerValues: { ...state, error: true, pending: false },
      }, () => {
        expect(getLoadBalancers).not.toBeCalled();
      });
    });
  });

  describe('when the load balancer list is available', () => {
    let getLoadBalancers;
    let onChange;
    let wrapper;
    beforeAll(() => {
      const state = {
        ...baseState,
        fulfilled: true,
        values: [0, 4, 8],
      };

      const quota = 4;

      getLoadBalancers = jest.fn();
      onChange = jest.fn();
      wrapper = mount(
        <LoadBalancersDropdown
          loadBalancerValues={state}
          input={{ onChange }}
          getLoadBalancers={getLoadBalancers}
          quota={quota}
          organization={organizationState}
          disabled={false}
        />,
      );
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
