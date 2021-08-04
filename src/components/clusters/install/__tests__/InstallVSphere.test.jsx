import React from 'react';
import { shallow } from 'enzyme';

import InstallVSphere from '../InstallVSphere';

describe('InstallVSphere', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstallVSphere />);
    expect(wrapper).toMatchSnapshot();
  });
});
