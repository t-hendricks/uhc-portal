import React from 'react';
import { shallow } from 'enzyme';

import { InstallPlatformAgnosticUPI } from '../InstallPlatformAgnosticUPI';

describe('Platform agnostic UPI install', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstallPlatformAgnosticUPI token={{}} dispatch={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
});
