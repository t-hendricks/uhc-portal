import React from 'react';
import { shallow } from 'enzyme';

import { InstallGCPUPI } from '../InstallGCPUPI';

describe('InstallGCPUPI', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstallGCPUPI token={{}} dispatch={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
});
