import React from 'react';
import { shallow } from 'enzyme';

import { InstallAWSUPI } from '../InstallAWSUPI';

describe('InstallAWSUPI', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstallAWSUPI token={{}} dispatch={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
});
