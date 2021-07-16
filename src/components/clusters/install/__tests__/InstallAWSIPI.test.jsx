import React from 'react';
import { shallow } from 'enzyme';

import { InstallAWSIPI } from '../InstallAWSIPI';

describe('InstallAWSIPI', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstallAWSIPI token={{}} dispatch={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
});
