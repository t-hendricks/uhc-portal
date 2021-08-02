import React from 'react';
import { shallow } from 'enzyme';

import { InstallRHVIPI } from '../InstallRHVIPI';

describe('InstallRHVIPI', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstallRHVIPI token={{}} dispatch={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
});
