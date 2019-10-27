import React from 'react';
import { shallow } from 'enzyme';

import ClusterListFilterChipGroup from './ClusterListFilterChipGroup';

describe('<ClusterListFilterChipGroup />', () => {
  it('should render', () => {
    const wrapper = shallow(<ClusterListFilterChipGroup setFilter={jest.fn()} currentFilters={{ entitlement_status: ['NotSet'] }} />);
    expect(wrapper).toMatchSnapshot();
  });
});
