import React from 'react';
import { shallow } from 'enzyme';

import ClusterListFilterChipGroup from './ClusterListFilterChipGroup';

describe('<ClusterListFilterChipGroup />', () => {
  it('should render', () => {
    const wrapper = shallow(<ClusterListFilterChipGroup setFilter={jest.fn()} currentFilter={['NotSet']} />);
    expect(wrapper).toMatchSnapshot();
  });
});
