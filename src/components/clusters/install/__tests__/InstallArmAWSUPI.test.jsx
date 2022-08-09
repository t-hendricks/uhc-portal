import React from 'react';
import { shallow } from 'enzyme';

import { InstallArmAWSUPI } from '../InstallArmAWSUPI';

describe('InstallArmAWSUPI', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstallArmAWSUPI token={{}} dispatch={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
});
