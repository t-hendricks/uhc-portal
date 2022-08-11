import React from 'react';
import { shallow } from 'enzyme';

import { InstallMultiPreRelease } from '../InstallMultiPreRelease';

describe('InstallMultiPreRelease', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstallMultiPreRelease token={{}} dispatch={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
});
