import React from 'react';
import { shallow } from 'enzyme';

import { InstallIBM } from '../InstallIBM';

describe('InstallIBM', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstallIBM token={{}} dispatch={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
});
