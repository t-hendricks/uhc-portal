import React from 'react';
import { shallow } from 'enzyme';

import InstallGCP from '../InstallGCP';

describe('InstallGCP', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstallGCP />);
    expect(wrapper).toMatchSnapshot();
  });
});
