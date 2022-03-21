import React from 'react';
import { shallow } from 'enzyme';

import InstructionsASH from '../InstructionsASH';

describe('Azure Stack Hub instructions', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstructionsASH />);
    expect(wrapper).toMatchSnapshot();
  });
});
