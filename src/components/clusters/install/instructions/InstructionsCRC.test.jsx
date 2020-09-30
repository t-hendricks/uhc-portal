import React from 'react';
import { shallow } from 'enzyme';
import InstructionsCRC from './InstructionsCRC';

describe('CRC instructions', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstructionsCRC token={{}} />);
    expect(wrapper).toMatchSnapshot();
  });
});
