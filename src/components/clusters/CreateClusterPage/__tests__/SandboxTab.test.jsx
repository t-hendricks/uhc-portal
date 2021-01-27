import React from 'react';
import { shallow } from 'enzyme';

import SandboxTab from '../SandboxTab';

describe('<SandboxTab />', () => {
  it('renders correctly', () => {
    const wrapper = shallow(
      <SandboxTab
        token={{}}
      />,
    );
    expect(wrapper).toMatchSnapshot();
  });
});
