import React from 'react';
import { shallow } from 'enzyme';

import { InstallPowerVirtualServerIPI } from '../InstallPowerVirtualServerIPI';

describe('InstallPower', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstallPowerVirtualServerIPI token={{}} dispatch={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
});
