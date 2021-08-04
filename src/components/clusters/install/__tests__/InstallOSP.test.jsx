import React from 'react';
import { shallow } from 'enzyme';

import InstallOSP from '../InstallOSP';

describe('InstallOSP', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstallOSP />);
    expect(wrapper).toMatchSnapshot();
  });
});
