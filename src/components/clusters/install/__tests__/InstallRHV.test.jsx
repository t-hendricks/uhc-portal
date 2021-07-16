import React from 'react';
import { shallow } from 'enzyme';

import InstallRHV from '../InstallRHV';

describe('InstallRHV', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstallRHV />);
    expect(wrapper).toMatchSnapshot();
  });
});
