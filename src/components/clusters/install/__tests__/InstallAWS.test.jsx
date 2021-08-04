import React from 'react';
import { shallow } from 'enzyme';

import InstallAWS from '../InstallAWS';

describe('InstallAWS', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstallAWS />);
    expect(wrapper).toMatchSnapshot();
  });
});
