import React from 'react';
import { shallow } from 'enzyme';

import { InstallASHUPI } from '../InstallASHUPI';

describe('InstallASHUPI', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstallASHUPI token={{}} dispatch={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
});
