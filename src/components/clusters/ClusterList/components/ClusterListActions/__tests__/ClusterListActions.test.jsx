import React from 'react';
import { shallow } from 'enzyme';

import ClusterListActions from '../ClusterListActions';

describe('<ClusterListActions />', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<ClusterListActions />);
    expect(wrapper).toMatchSnapshot();
  });
});
