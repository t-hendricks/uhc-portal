import React from 'react';
import { shallow } from 'enzyme';

import ClusterListFilterChipGroup from './ClusterListFilterChipGroup';

describe('<ClusterListFilterChipGroup />', () => {
  it('should render', () => {
    const wrapper = shallow(
      <ClusterListFilterChipGroup
        setFilter={jest.fn()}
        currentFilters={{ plan_id: ['OSD'] }}
        history={{ location: 'my-url', push: jest.fn() }}
      />,
    );
    expect(wrapper).toMatchSnapshot();
  });
});
