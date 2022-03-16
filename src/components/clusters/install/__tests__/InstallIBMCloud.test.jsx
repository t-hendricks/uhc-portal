import React from 'react';
import { shallow } from 'enzyme';

import { InstallIBMCloud } from '../InstallIBMCloud';

describe('InstallIBMCloud', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstallIBMCloud token={{}} dispatch={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
});
