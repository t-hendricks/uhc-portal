import React from 'react';
import { shallow } from 'enzyme';

import { InstallMultiAWSIPI } from '../InstallMultiAWSIPI';

describe('InstallMultiAWSIPI', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstallMultiAWSIPI token={{}} dispatch={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
});
