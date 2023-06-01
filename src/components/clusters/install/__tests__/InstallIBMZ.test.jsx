import React from 'react';
import { shallow } from 'enzyme';

import InstallIBMZ from '../InstallIBMZ';

describe('InstallIBMZ', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstallIBMZ />);
    expect(wrapper).toMatchSnapshot();
  });
});
