import React from 'react';
import { shallow } from 'enzyme';

import DatacenterTab from '../DatacenterTab';

describe('<DatacenterTab />', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<DatacenterTab />);
    expect(wrapper).toMatchSnapshot();
  });
});
