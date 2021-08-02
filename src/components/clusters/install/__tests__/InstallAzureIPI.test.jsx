import React from 'react';
import { shallow } from 'enzyme';

import { InstallAzureIPI } from '../InstallAzureIPI';

describe('InstallAzureIPI', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstallAzureIPI token={{}} dispatch={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
});
