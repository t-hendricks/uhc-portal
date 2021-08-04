import React from 'react';
import { shallow } from 'enzyme';

import { InstallOSPUPI } from '../InstallOSPUPI';

describe('InstallOSPUPI', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstallOSPUPI token={{}} dispatch={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
});
