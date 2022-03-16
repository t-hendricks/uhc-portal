import React from 'react';
import { shallow } from 'enzyme';

import { InstallASHIPI } from '../InstallASHIPI';

describe('InstallASHIPI', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstallASHIPI token={{}} dispatch={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
});
