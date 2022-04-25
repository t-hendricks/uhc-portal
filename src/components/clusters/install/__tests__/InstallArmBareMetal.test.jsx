import React from 'react';
import { shallow } from 'enzyme';

import InstallArmBareMetal from '../InstallArmBareMetal';

describe('ARM Bare Metal install', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstallArmBareMetal />);
    expect(wrapper).toMatchSnapshot();
  });
});
