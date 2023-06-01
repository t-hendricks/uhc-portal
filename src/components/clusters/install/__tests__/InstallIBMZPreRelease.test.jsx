import React from 'react';
import { shallow } from 'enzyme';

import { InstallIBMZPreRelease } from '../InstallIBMZPreRelease';

describe('InstallIBMZPreRelease', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstallIBMZPreRelease token={{}} dispatch={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
});
