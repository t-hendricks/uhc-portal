import React from 'react';
import { shallow } from 'enzyme';

import Overview from '../components/Overview/Overview';
import { clusterDetails, cloudProviders, routerShards } from './ClusterDetails.fixtures';

describe('<Overview />', () => {
  const props = { cluster: clusterDetails.cluster, cloudProviders, routerShards };
  const wrapper = shallow(
    <Overview {...props} />,
  );

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
