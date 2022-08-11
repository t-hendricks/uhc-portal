import React from 'react';
import { shallow } from 'enzyme';

import { InstallNutanixIPI } from '../InstallNutanixIPI';

describe('InstallNutanixIPI', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstallNutanixIPI token={{}} dispatch={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
});
