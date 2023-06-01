import React from 'react';
import { shallow } from 'enzyme';

import { InstallPowerUPI } from '../InstallPowerUPI';

describe('InstallPower', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstallPowerUPI token={{}} dispatch={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
});
