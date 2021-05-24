import React from 'react';
import { shallow } from 'enzyme';

import Overview from '../components/Overview/Overview';
import fixtures from './ClusterDetails.fixtures';

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
    const wrapper = shallow(
      <Overview {...props} />,
    );

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
    const wrapper = shallow(
      <Overview {...props} />,
    );
    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
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
    const wrapper = shallow(
      <Overview {...props} />,
    );
    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
