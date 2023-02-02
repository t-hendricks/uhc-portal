import React from 'react';
import { shallow } from 'enzyme';

import { InstallArmAzureIPI } from '../InstallArmAzureIPI';

describe('InstallArmAzureIPI', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstallArmAzureIPI token={{}} dispatch={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
});
