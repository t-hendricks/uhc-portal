import React from 'react';
import { shallow } from 'enzyme';

import LaptopTab from '../DatacenterTab';

describe('<DatacenterTab />', () => {
  it('renders correctly', () => {
    const wrapper = shallow(
      <LaptopTab
        token={{}}
      />,
    );
    expect(wrapper).toMatchSnapshot();
  });
});
