import React from 'react';
import { shallow } from 'enzyme';

import InstallNutanix from '../InstallNutanix';

describe('InstallNutanix', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstallNutanix />);
    expect(wrapper).toMatchSnapshot();
  });
});
