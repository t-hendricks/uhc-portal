import React from 'react';
import { shallow } from 'enzyme';

import Overview from '../components/Overview/Overview';
import fixtures from './ClusterDetails.fixtures';

describe('<Overview />', () => {
  const props = {
    cluster: fixtures.clusterDetails.cluster,
    cloudProviders: fixtures.cloudProviders,
    history: {},
    displayClusterLogs: false,
  };
  const wrapper = shallow(
    <Overview {...props} />,
  );

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });
});

describe('Overview Cluster Not Managed', () => {
  const props = {
    cluster: fixtures.clusterDetailsNotManaged.cluster,
    cloudProviders: fixtures.cloudProviders,
    history: {},
    displayClusterLogs: true,
  };
  const wrapper = shallow(
    <Overview {...props} />,
  );

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
