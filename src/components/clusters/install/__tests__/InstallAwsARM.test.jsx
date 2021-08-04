import React from 'react';
import { shallow } from 'enzyme';

import { InstructionsAwsARM } from '../InstallAwsARM';

describe('InstallAwsARM', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstructionsAwsARM token={{}} dispatch={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
});
