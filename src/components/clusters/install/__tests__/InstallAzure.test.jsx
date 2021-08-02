import React from 'react';
import { shallow } from 'enzyme';

import InstallAzure from '../InstallAzure';

describe('InstallAzure', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstallAzure />);
    expect(wrapper).toMatchSnapshot();
  });
});
