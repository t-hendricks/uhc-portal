import React from 'react';
import { shallow } from 'enzyme';

import { InstallArmPreRelease } from '../InstallArmPreRelease';

describe('InstallArmPreRelease', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstallArmPreRelease token={{}} dispatch={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
});
