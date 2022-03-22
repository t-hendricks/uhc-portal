import React from 'react';
import { shallow } from 'enzyme';

import { InstallArmAWSIPI } from '../InstallArmAWSIPI';

describe('InstallArmAWSIPI', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstallArmAWSIPI token={{}} dispatch={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
});
