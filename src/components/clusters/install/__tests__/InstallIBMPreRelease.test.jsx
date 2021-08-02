import React from 'react';
import { shallow } from 'enzyme';

import { InstallIBMPreRelease } from '../InstallIBMPreRelease';

describe('InstallIBMPreRelease', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstallIBMPreRelease token={{}} dispatch={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
});
