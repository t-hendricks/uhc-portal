import React from 'react';
import { shallow } from 'enzyme';

import InstructionsGCP from '../InstructionsGCP';

describe('GCP instructions', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstructionsGCP />);
    expect(wrapper).toMatchSnapshot();
  });
});
