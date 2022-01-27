import React from 'react';
import { shallow } from 'enzyme';

import { InstallArmBareMetalUPI } from '../InstallArmBareMetalUPI';

describe('Arm BareMetal UPI install', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstallArmBareMetalUPI token={{}} dispatch={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
});
