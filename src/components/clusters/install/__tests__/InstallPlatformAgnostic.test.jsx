import React from 'react';
import { shallow } from 'enzyme';

import { InstallPlatformAgnostic } from '../InstallPlatformAgnostic';

describe('Platform agnostic install', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstallPlatformAgnostic token={{}} dispatch={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
});
