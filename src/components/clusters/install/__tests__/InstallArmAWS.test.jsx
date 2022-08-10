import React from 'react';
import { shallow } from 'enzyme';

import InstallArmAWS from '../InstallArmAWS';

describe('InstallArmAWS', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstallArmAWS />);
    expect(wrapper).toMatchSnapshot();
  });
});
