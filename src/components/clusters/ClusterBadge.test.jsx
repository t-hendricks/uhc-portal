import React from 'react';
import { shallow } from 'enzyme';

import ClusterBadge from './ClusterBadge';

describe('<ClusterBadge />', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<ClusterBadge clusterName="whatever" />);
    expect(wrapper).toMatchSnapshot();
  });
});
