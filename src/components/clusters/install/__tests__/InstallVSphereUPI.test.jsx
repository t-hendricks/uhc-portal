import React from 'react';
import { shallow } from 'enzyme';

import { InstallVSphereUPI } from '../InstallVSphereUPI';

describe('InstallVSphereUPI', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstallVSphereUPI token={{}} dispatch={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
});
