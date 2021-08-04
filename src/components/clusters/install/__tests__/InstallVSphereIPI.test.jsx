import React from 'react';
import { shallow } from 'enzyme';

import { InstallVSphereIPI } from '../InstallVSphereIPI';

describe('InstallVSphereIPI', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstallVSphereIPI token={{}} dispatch={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
});
