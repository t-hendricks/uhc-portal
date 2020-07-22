import React from 'react';
import { shallow } from 'enzyme';

import ClusterListEmptyState from '../ClusterListEmptyState';

describe('<ClusterListEmptyState />', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<ClusterListEmptyState />);
    expect(wrapper).toMatchSnapshot();
  });
});
