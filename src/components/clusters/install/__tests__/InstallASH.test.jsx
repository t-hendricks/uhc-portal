import React from 'react';
import { shallow } from 'enzyme';

import InstallASH from '../InstallASH';

describe('InstallASH', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstallASH />);
    expect(wrapper).toMatchSnapshot();
  });
});
