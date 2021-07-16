import React from 'react';
import { shallow } from 'enzyme';

import InstructionsRHV from '../InstructionsRHV';

describe('RHV instructions', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstructionsRHV />);
    expect(wrapper).toMatchSnapshot();
  });
});
