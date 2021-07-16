import React from 'react';
import { shallow } from 'enzyme';

import { InstallBareMetalIPI } from '../InstallBareMetalIPI';

describe('InstallBareMetalIPI', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstallBareMetalIPI token={{}} dispatch={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
});
