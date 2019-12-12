import React from 'react';
import { mount } from 'enzyme';

import LoadBalancerComboBox from './LoadBalancersComboBox';

const baseState = {
  error: false,
  errorMessage: '',
  pending: false,
  fulfilled: false,
  values: [],
};

describe('<LoadBalancerComboBox />', () => {
  describe('when load balancer list needs to be fetched', () => {
    let getLoadBalancers;
    let onChange;
    let wrapper;
    beforeAll(() => {
      getLoadBalancers = jest.fn();
      onChange = jest.fn();
      wrapper = mount(
        <LoadBalancerComboBox
          loadBalancerValues={baseState}
          input={{ onChange }}
          getLoadBalancers={getLoadBalancers}
        />,
      );
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('calls getLoadBalancers', () => {
      expect(getLoadBalancers).toBeCalled();
    });

    it('calls onChange to mark as invalid', () => {
      expect(onChange).toBeCalledWith('');
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
        <LoadBalancerComboBox
          loadBalancerValues={state}
          input={{ onChange }}
          getLoadBalancers={getLoadBalancers}
        />,
      );
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('calls getLoadBalancers on mount', () => {
      expect(getLoadBalancers).toBeCalled();
    });

    it('calls onChange to mark as invalid', () => {
      expect(onChange).toBeCalledWith('');
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
        <LoadBalancerComboBox
          loadBalancerValues={state}
          input={{ onChange }}
          getLoadBalancers={getLoadBalancers}
        />,
      );
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('calls onChange to mark as invalid', () => {
      expect(onChange).toBeCalledWith('');
    });

    it('does not call getLoadBalancers again if request returns an error', () => {
      wrapper.setProps({
        machineTypes: { ...state, error: true, pending: false },
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

      getLoadBalancers = jest.fn();
      onChange = jest.fn();
      wrapper = mount(
        <LoadBalancerComboBox
          loadBalancerValues={state}
          input={{ onChange }}
          getLoadBalancers={getLoadBalancers}
        />,
      );
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('does not call getLoadBalancers', () => {
      expect(getLoadBalancers).not.toBeCalled();
    });
  });
});
