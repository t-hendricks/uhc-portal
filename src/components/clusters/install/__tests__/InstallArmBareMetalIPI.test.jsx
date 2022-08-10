import React from 'react';
import { shallow } from 'enzyme';

import { InstallArmBareMetalIPI } from '../InstallArmBareMetalIPI';

describe('Arm BareMetal IPI install', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstallArmBareMetalIPI token={{}} dispatch={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
});
