import React from 'react';
import { shallow } from 'enzyme';

import InstructionsAWS from '../InstructionsAWS';

describe('AWS instructions', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstructionsAWS />);
    expect(wrapper).toMatchSnapshot();
  });
});
