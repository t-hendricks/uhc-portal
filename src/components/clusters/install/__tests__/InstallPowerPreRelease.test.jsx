import React from 'react';
import { shallow } from 'enzyme';

import { InstallPowerPreRelease } from '../InstallPowerPreRelease';

describe('InstallPowerPreRelease', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstallPowerPreRelease token={{}} dispatch={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
});
