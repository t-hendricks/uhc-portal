import React from 'react';
import { shallow } from 'enzyme';

import { InstallRHVUPI } from '../InstallRHVUPI';

describe('InstallRHVUPI', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstallRHVUPI token={{}} dispatch={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
});
