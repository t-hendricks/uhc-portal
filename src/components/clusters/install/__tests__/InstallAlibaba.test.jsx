import React from 'react';
import { shallow } from 'enzyme';

import { InstallAlibaba } from '../InstallAlibaba';

describe('InstallAlibaba', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstallAlibaba token={{}} dispatch={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
});
