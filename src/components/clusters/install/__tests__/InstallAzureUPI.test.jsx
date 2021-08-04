import React from 'react';
import { shallow } from 'enzyme';

import { InstallAzureUPI } from '../InstallAzureUPI';

describe('InstallAzureUPI', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstallAzureUPI token={{}} dispatch={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
});
