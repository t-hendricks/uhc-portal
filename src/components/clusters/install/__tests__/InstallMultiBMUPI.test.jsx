import React from 'react';
import { shallow } from 'enzyme';

import { InstallMultiBareMetalUPI } from '../InstallMultiBareMetalUPI';

describe('InstallMultiBMUPI', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstallMultiBareMetalUPI token={{}} dispatch={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
});
