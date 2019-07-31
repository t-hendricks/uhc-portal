import React from 'react';
import { shallow } from 'enzyme';

import ClusterNetwork from '../components/Overview/ClusterNetwork';
import { clusterDetails } from './ClusterDetails.fixtures';

describe('<ClusterNetwork />', () => {
  let wrapper;
  beforeAll(() => {
    wrapper = shallow(
      <ClusterNetwork cluster={clusterDetails.cluster} />,
    );
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
