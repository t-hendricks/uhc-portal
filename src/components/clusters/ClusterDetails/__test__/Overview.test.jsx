import React from 'react';
import { shallow } from 'enzyme';

import Overview from '../components/Overview/Overview';
import fixtures from './ClusterDetails.fixtures';

describe('<Overview />', () => {
  const props = {
    cluster: fixtures.clusterDetails.cluster,
    cloudProviders: fixtures.cloudProviders,
  };
  const wrapper = shallow(
    <Overview {...props} />,
  );

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
