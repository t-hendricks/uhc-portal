import React from 'react';
import { shallow } from 'enzyme';

import { InstallPreRelease } from '../InstallPreRelease';

describe('InstallPreRelease', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstallPreRelease token={{}} dispatch={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
});
