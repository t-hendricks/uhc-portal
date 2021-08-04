import React from 'react';
import { shallow } from 'enzyme';

import InstructionsOSP from '../InstructionsOSP';

describe('OSP instructions', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstructionsOSP />);
    expect(wrapper).toMatchSnapshot();
  });
});
