import React from 'react';
import { shallow } from 'enzyme';

import InstallBareMetal from '../InstallBareMetal';

describe('BareMetal install', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstallBareMetal />);
    expect(wrapper).toMatchSnapshot();
  });
});
