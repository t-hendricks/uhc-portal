import React from 'react';
import { shallow } from 'enzyme';
import { screen } from '@testing-library/dom';

import { subscriptionStatuses } from '../../../../common/subscriptionTypes';
import Overview from '../components/Overview/Overview';
import fixtures from './ClusterDetails.fixtures';
import { mockRestrictedEnv, render } from '../../../../testUtils';

describe('<Overview />', () => {
  describe('for an OSD cluster', () => {
    const props = {
      cluster: fixtures.clusterDetails.cluster,
      cloudProviders: fixtures.cloudProviders,
      history: {},
      displayClusterLogs: false,
      openModal: jest.fn(),
      insightsData: {},
      userAccess: fixtures.userAccess,
    };
    const wrapper = shallow(<Overview {...props} />);

    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('for an OCP cluster', () => {
    const props = {
      cluster: fixtures.OCPClusterDetails.cluster,
      cloudProviders: fixtures.cloudProviders,
      history: {},
      displayClusterLogs: true,
      openModal: jest.fn(),
      insightsData: fixtures.insightsData,
      userAccess: fixtures.userAccess,
    };
    const wrapper = shallow(<Overview {...props} />);
    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should render side panel', () => {
      expect(wrapper.find('ResourceUsage').length).toEqual(1);
      expect(wrapper.find('InsightsAdvisor').length).toEqual(1);
      expect(wrapper.find('Connect(CostBreakdownCard)').length).toEqual(1);
    });

    it('should render subscription settings', () => {
      expect(wrapper.find('Connect(SubscriptionSettings)').length).toEqual(1);
    });
  });

  describe('for an ARO cluster', () => {
    const props = {
      cluster: fixtures.AROClusterDetails.cluster,
      cloudProviders: fixtures.cloudProviders,
      history: {},
      displayClusterLogs: true,
      openModal: jest.fn(),
      insightsData: {},
      userAccess: fixtures.userAccess,
    };
    const wrapper = shallow(<Overview {...props} />);
    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('for an Archived OCP cluster', () => {
    const props = {
      cluster: {
        ...fixtures.OCPClusterDetails.cluster,
        subscription: {
          ...fixtures.OCPClusterDetails.cluster.subscription,
          status: subscriptionStatuses.ARCHIVED,
        },
      },
      cloudProviders: fixtures.cloudProviders,
      history: {},
      displayClusterLogs: true,
      openModal: jest.fn(),
      insightsData: fixtures.insightsData,
      userAccess: fixtures.userAccess,
    };
    const wrapper = shallow(<Overview {...props} />);
    it('should not render side panel', () => {
      expect(wrapper.find('ResourceUsage').length).toEqual(0);
      expect(wrapper.find('InsightsAdvisor').length).toEqual(0);
      expect(wrapper.find('Connect(CostBreakdownCard)').length).toEqual(0);
    });

    it('should not render subscription settings', () => {
      expect(wrapper.find('Connect(SubscriptionSettings)').length).toEqual(0);
    });
  });

  describe('for an AI cluster', () => {
    const props = {
      cluster: fixtures.AIClusterDetails.cluster,
      cloudProviders: fixtures.cloudProviders,
      history: {},
      displayClusterLogs: true,
      openModal: jest.fn(),
      insightsData: {},
      userAccess: fixtures.userAccess,
    };
    const wrapper = shallow(<Overview {...props} />);
    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('in Restricted env', () => {
    const isRestrictedEnv = mockRestrictedEnv();

    afterEach(() => {
      isRestrictedEnv.mockReturnValue(false);
    });

    it('should not render insights and resource usage', () => {
      const props = {
        cluster: fixtures.ROSAClusterDetails.cluster,
        cloudProviders: fixtures.cloudProviders,
        history: {},
        displayClusterLogs: true,
        openModal: jest.fn(),
        insightsData: {
          status: 200,
          data: [],
        },
        userAccess: fixtures.userAccess,
      };

      const { rerender } = render(<Overview {...props} />);
      expect(screen.queryByTestId('insights-advisor')).toBeInTheDocument();
      expect(screen.queryByTestId('resource-usage')).toBeInTheDocument();
      isRestrictedEnv.mockReturnValue(true);
      rerender(<Overview {...props} />);
      expect(screen.queryByTestId('insights-advisor')).not.toBeInTheDocument();
      expect(screen.queryByTestId('resource-usage')).not.toBeInTheDocument();
    });
  });
});
