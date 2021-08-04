import React from 'react';
import { shallow } from 'enzyme';

import { InstallPower } from '../InstallPower';

describe('InstallPower', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstallPower token={{}} dispatch={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
});
