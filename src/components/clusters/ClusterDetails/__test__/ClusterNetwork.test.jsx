import React from 'react';
import { shallow } from 'enzyme';

import ClusterNetwork from '../components/Overview/ClusterNetwork';
import fixtures from './ClusterDetails.fixtures';

describe('<ClusterNetwork />', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(
      <ClusterNetwork cluster={fixtures.clusterDetails.cluster} />,
    );
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
