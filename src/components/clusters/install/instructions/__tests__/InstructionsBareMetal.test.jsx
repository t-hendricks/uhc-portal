import React from 'react';
import { shallow } from 'enzyme';

import InstructionsBareMetal from '../InstructionsBareMetal';

describe('BareMetal instructions', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstructionsBareMetal />);
    expect(wrapper).toMatchSnapshot();
  });
});
