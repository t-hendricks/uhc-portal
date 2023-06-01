import React from 'react';
import { shallow } from 'enzyme';

import { InstallIBMZUPI } from '../InstallIBMZUPI';

describe('InstallPower', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstallIBMZUPI token={{}} dispatch={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
});
