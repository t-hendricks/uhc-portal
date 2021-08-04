import React from 'react';
import { shallow } from 'enzyme';

import { InstallGCPIPI } from '../InstallGCPIPI';

describe('InstallGCPIPI', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstallGCPIPI token={{}} dispatch={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
});
