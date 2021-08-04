import React from 'react';
import { shallow } from 'enzyme';

import { InstallOSPIPI } from '../InstallOSPIPI';

describe('InstallOSPIPI', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstallOSPIPI token={{}} dispatch={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
});
