import React from 'react';
import { shallow } from 'enzyme';

import InstructionsVSphere from '../InstructionsVSphere';

describe('VSphere instructions', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstructionsVSphere />);
    expect(wrapper).toMatchSnapshot();
  });
});
