import React from 'react';
import { shallow } from 'enzyme';

import { InstallMultiAzureIPI } from '../InstallMultiAzureIPI';

describe('InstallMultiAzureIPI', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstallMultiAzureIPI token={{}} dispatch={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
});
