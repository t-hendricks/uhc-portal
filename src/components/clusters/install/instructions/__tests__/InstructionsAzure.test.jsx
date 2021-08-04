import React from 'react';
import { shallow } from 'enzyme';

import InstructionsAzure from '../InstructionsAzure';

describe('Azure instructions', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstructionsAzure />);
    expect(wrapper).toMatchSnapshot();
  });
});
