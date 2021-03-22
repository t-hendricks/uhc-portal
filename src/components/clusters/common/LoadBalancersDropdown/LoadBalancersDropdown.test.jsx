import React from 'react';
import { mount } from 'enzyme';

import LoadBalancersDropdown from './LoadBalancersDropdown';
import fixtures from '../../ClusterDetails/__test__/ClusterDetails.fixtures';

const baseState = {
  error: false,
  errorMessage: '',
  pending: false,
  fulfilled: false,
  values: [],
};

const quotaList = {
  loadBalancerQuota: {
    standard: {
      OSD: {
        aws: {
          rhInfra: {
            singleAZ: {
              network: 40,
            },
          },
        },
      },
    },
  },
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
          quotaList={quotaList}
          product={fixtures.clusterDetails.cluster.product.id}
          cloudProviderID={fixtures.clusterDetails.cluster.cloud_provider.id}
          billingModel="standard"
          isBYOC={fixtures.clusterDetails.cluster.ccs.enabled}
          isMultiAZ={fixtures.clusterDetails.cluster.multi_az}
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
          quotaList={quotaList}
          product={fixtures.clusterDetails.cluster.product.id}
          cloudProviderID={fixtures.clusterDetails.cluster.cloud_provider.id}
          billingModel="standard"
          isBYOC={fixtures.clusterDetails.cluster.ccs.enabled}
          isMultiAZ={fixtures.clusterDetails.cluster.multi_az}
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
          quotaList={quotaList}
          product={fixtures.clusterDetails.cluster.product.id}
          cloudProviderID={fixtures.clusterDetails.cluster.cloud_provider.id}
          billingModel="standard"
          isBYOC={fixtures.clusterDetails.cluster.ccs.enabled}
          isMultiAZ={fixtures.clusterDetails.cluster.multi_az}
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

      getLoadBalancers = jest.fn();
      onChange = jest.fn();
      wrapper = mount(
        <LoadBalancersDropdown
          loadBalancerValues={state}
          input={{ onChange }}
          getLoadBalancers={getLoadBalancers}
          quotaList={quotaList}
          product={fixtures.clusterDetails.cluster.product.id}
          cloudProviderID={fixtures.clusterDetails.cluster.cloud_provider.id}
          billingModel="standard"
          isBYOC={fixtures.clusterDetails.cluster.ccs.enabled}
          isMultiAZ={fixtures.clusterDetails.cluster.multi_az}
          disabled={false}
        />,
      );
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
