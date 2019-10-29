import React from 'react';
import { shallow } from 'enzyme';

import ClusterListFilterDropdown from './ClusterListFilterDropdown';

describe('<ClusterListFilterDropdown />', () => {
  it('should render', () => {
    const wrapper = shallow(
      <ClusterListFilterDropdown
        setFilter={jest.fn()}
        currentFilters={{}}
        history={{ push: jest.fn() }}
      />,
    );
    expect(wrapper).toMatchSnapshot();
  });
});
