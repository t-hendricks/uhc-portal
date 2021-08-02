import React from 'react';
import { shallow } from 'enzyme';

import { InstallPullSecret } from '../InstallPullSecret';

describe('InstallPullSecret', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstallPullSecret token={{}} dispatch={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
});
